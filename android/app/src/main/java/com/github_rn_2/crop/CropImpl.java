package com.github_rn_2.crop;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;

/**
 * React Native Android原生模块开发
 * Author: CrazyCodeBoy
 * https://coding.imooc.com/class/304.html
 * 答疑：https://coding.imooc.com/learn/qa/304.html
 */

public class CropImpl implements ActivityEventListener, Crop {
    private final int RC_READ = 50001;
    private final int RC_PICK = 50081;
    private final int RC_CROP = 50082;
    private final String CODE_ERROR_PICK = "用户取消";
    private final String CODE_ERROR_CROP = "裁切失败";

    private Promise pickPromise;
    private Uri outPutUri;
    private int aspectX;
    private int aspectY;
    private Activity activity;

    public static CropImpl of(Activity activity) {
        return new CropImpl(activity);
    }

    private CropImpl(Activity activity) {
        this.activity = activity;
    }

    public void updateActivity(Activity activity) {
        this.activity = activity;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == RC_PICK) {
            if (resultCode == Activity.RESULT_OK && data != null) {//从相册选择照片并裁剪
                outPutUri = Uri.fromFile(Utils.getPhotoCacheDir(System.currentTimeMillis() + ".jpg"));
                onCrop(data.getData(), outPutUri);
            } else {
                pickPromise.reject(CODE_ERROR_PICK, "没有获取到结果");
            }
        } else if (requestCode == RC_CROP) {
            if (resultCode == Activity.RESULT_OK) {
                pickPromise.resolve(outPutUri.getPath());
            } else {
                pickPromise.reject(CODE_ERROR_CROP, "裁剪失败");
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
    }

    @Override
    public void selectWithCrop(int aspectX, int aspectY, Promise promise) {
        this.pickPromise = promise;
        this.aspectX = aspectX;
        this.aspectY = aspectY;
        checkPermission();
    }

    /**
     * 权限检查
     */
    private void checkPermission() {
        if (ContextCompat.checkSelfPermission(this.activity, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
            this.activity.startActivityForResult(IntentUtils.getPickIntentWithGallery(), RC_PICK);
        } else {
            ActivityCompat.requestPermissions(this.activity, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, RC_READ);
            Toast.makeText(this.activity, "请开启存储权限后在继续", Toast.LENGTH_SHORT).show();
        }

    }

    private void onCrop(Uri targetUri, Uri outputUri) {
        this.activity.startActivityForResult(IntentUtils.getCropIntentWith(targetUri, outputUri, aspectX, aspectY), RC_CROP);
    }
}

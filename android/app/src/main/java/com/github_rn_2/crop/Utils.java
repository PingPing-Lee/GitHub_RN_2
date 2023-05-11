package com.github_rn_2.crop;

import android.os.Environment;
import java.io.File;

/**
 * React Native Android原生模块开发
 * Author: CrazyCodeBoy
 * https://coding.imooc.com/class/304.html
 * 答疑：https://coding.imooc.com/learn/qa/304.html
 */

public class Utils {
    /**ReactContextBaseJavaModule
     * 获取一个临时文件
     * @param fileName
     * @return
     */
    public static File getPhotoCacheDir(String fileName) {
        return new File(Environment.getExternalStorageDirectory().getAbsoluteFile(),fileName);
    }
}

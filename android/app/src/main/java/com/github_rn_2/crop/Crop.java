package com.github_rn_2.crop;

import com.facebook.react.bridge.Promise;

public interface Crop {
    /**
     * 选择并裁切照片
     * @param outputX
     * @param outputY
     * @param promise
     */
    void selectWithCrop(int outputX,int outputY,Promise promise);
}

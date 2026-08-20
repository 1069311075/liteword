package com.liteword.app;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 沉浸式：让视频背景延伸到状态栏区域，状态栏透明
        getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
        // 允许明文 HTTP 混合内容：
        // Capacitor 页面 origin 为 https://localhost，而云同步后端为 http://127.0.0.1:8000，
        // 属于混合内容，WebView 默认会拦截导致 fetch 失败。此处放开以便访问本地开发/演示后端。
        // 生产环境若后端改为 https，可移除本段。
        try {
            WebSettings ws = getBridge().getWebView().getSettings();
            ws.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            ws.setAllowFileAccess(true);
        } catch (Exception ignored) {}
    }
}

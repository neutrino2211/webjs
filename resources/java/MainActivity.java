package {{PACKAGE_NAME}};

/**
 * Created by ADMIN on 15/09/2017.
 */
import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.os.Build;
import android.support.annotation.*;
import android.support.v7.app.AppCompatActivity;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.os.Bundle;
import {{PACKAGE_NAME}}.WebAppInterface;

public class MainActivity extends AppCompatActivity{

    final Activity activity =  this;

    WebView webview;



    Resources resources;
    String WEBSITE_URL = "file:///android_asset/www/index.html";
    String url;
    Context context;

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onCreate(Bundle savedInstance){
        super.onCreate(savedInstance);

        setContentView(R.layout.activity_main);

        webview = (WebView) findViewById(R.id.wv);

        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        webview.getSettings().setDomStorageEnabled(true);
        webview.getSettings().setLoadsImagesAutomatically(true);

        webview.addJavascriptInterface(new WebAppInterface(this),"native");

        webview.loadUrl(WEBSITE_URL);


    }
}

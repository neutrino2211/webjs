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
import android.webkit.*;
import android.view.KeyEvent;
import android.widget.Toast;
// import android.webkit.WebSettings;
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

    WebAppInterface wi;

    // @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onCreate(Bundle savedInstance){
        super.onCreate(savedInstance);
        final AppCompatActivity a = this;
        setContentView(R.layout.activity_main);

        webview = (WebView) findViewById(R.id.wv);
        wi = new WebAppInterface(this,webview);
        webview.getSettings().setJavaScriptEnabled(true);
        // webview.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        webview.getSettings().setDomStorageEnabled(true);
        webview.getSettings().setLoadsImagesAutomatically(true);
        //Interface
        webview.addJavascriptInterface(wi,"native");
        webview.setWebChromeClient(new WebChromeClient(){
            @Override
            public void onPermissionRequest(PermissionRequest r){
                r.grant(r.getResources());
            }
        });
        webview.setWebViewClient(new WebViewClient(){
            @Override 
            public void onReceivedError(WebView wv, WebResourceRequest r, WebResourceError e){
                Toast.makeText(a,"Request : '"+r+"' with error '"+e+"'",Toast.LENGTH_LONG).show();
            }
        });
        //Load
        webview.loadUrl(WEBSITE_URL);


    }

    @Override 
    public boolean onKeyDown(int Keycode,KeyEvent event){
        return wi.onKeyDown(Keycode,event)||super.onKeyDown(Keycode,event);
    }
}

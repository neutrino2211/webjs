package {{PACKAGE_NAME}};

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;
import java.util.Map;
import java.util.HashMap;
import android.view.KeyEvent;
import java.util.concurrent.Callable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import android.webkit.*;

//Extra imports dependencies

{{Dependencies}}

/**
 * Created by ADMIN on 24/12/2017.
 */

public class WebAppInterface {
    Context c;
    WebView w;
    boolean debug = false;
    {{EXTRA_IMPORTS_DECLARATION}}
    WebAppInterface(Context context, WebView wv){
        c = context;
        w = wv;
    }

    private Map<String,String> events = new HashMap<String,String>();

    @JavascriptInterface
    public void debugToast(boolean b){
        debug = b;
    }

    @JavascriptInterface
    public void toast(String text){
        Toast.makeText(c,text,Toast.LENGTH_LONG).show();
    }

    @JavascriptInterface
    public void call(String phone_number){
        String dial = "tel:" + phone_number;
        Intent call = new Intent(Intent.ACTION_DIAL, Uri.parse(dial));
        c.startActivity(call);
    }

    @JavascriptInterface
    public void exit(){
        Intent _EXIT = new Intent(Intent.ACTION_MAIN);
        _EXIT.addCategory(Intent.CATEGORY_HOME);
        _EXIT.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        c.startActivity(_EXIT);
    }

    @JavascriptInterface
    public String platform(){
        return "Android";
    }

    @JavascriptInterface
    public void  sms(String number,String body){
        String s = "smsto:" + number;
        Intent smsto = new Intent(Intent.ACTION_SENDTO,Uri.parse(s));
        smsto.putExtra("sms_body",body);
        c.startActivity(smsto);
    }

    @JavascriptInterface
    public void eventListener(String name,String function){
        events.put(name,function);
    }

    {{EXTRA_IMPORTS_INITIALIZATION}}

    public boolean onKeyDown(int keyCode, KeyEvent event){
        if(event.getAction() == KeyEvent.ACTION_DOWN && keyCode == KeyEvent.KEYCODE_BACK){
            if(events.containsKey("backButtonPressed")){
                // toast("javascript:"+events.get("backButtonPressed")+";");
                w.loadUrl("javascript:"+events.get("backButtonPressed")+";");
                return true;
            }
        }
        return false;
    }

    public void HandleChromeClientErrors(WebView wv, WebResourceRequest r, WebResourceError e){
        if(debug){
            Toast.makeText(c,"Request : '"+r+"' with error '"+e+"'",Toast.LENGTH_LONG).show();
        }
    }
}

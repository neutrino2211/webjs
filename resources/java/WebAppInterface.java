package {{PACKAGE_NAME}};

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/**
 * Created by ADMIN on 24/12/2017.
 */

public class WebAppInterface {
    Context c;

    WebAppInterface(Context context){
        c = context;
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
        c.finish();
    }

    @JavascriptInterface
    public void  sms(String number,String body){
        String s = "smsto:" + number;
        Intent smsto = new Intent(Intent.ACTION_SENDTO,Uri.parse(s));
        smsto.putExtra("sms_body",body);
        c.startActivity(smsto);
    }
}

# How to make wjs-cli modules

## Create folder

The name of this folder has to be in a specific format. The format is update-`wjs-cli target version (replace . with -)`_`update name e.g (AndroidFSWebviewPlugin)`, so for an update named `AndroidFSPlugin` targeting wjs-cli@0.1.3 the folder name will be `update-0-1-3_AndroidFSPlugin`

## Source file formats

wjs-cli uses placeholders in `MainActivity.java` and `WebAppInterface.java` to assign package names to android apps so any where the app package name is required use `{{PACKAGE_NAME}}` e.g

### WebAppInterface.java

```java
package {{PACKAGE_NAME}};

//{{PACKAGE_NAME}} gets replaced with the package name of the app e.g com.wjs.test.packages

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
        Intent _EXIT = new Intent(Intent.ACTION_MAIN);
        _EXIT.addCategory(Intent.CATEGORY_HOME);
        _EXIT.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        c.startActivity(_EXIT);
    }

    @JavascriptInterface
    public void  sms(String number,String body){
        String s = "smsto:" + number;
        Intent smsto = new Intent(Intent.ACTION_SENDTO,Uri.parse(s));
        smsto.putExtra("sms_body",body);
        c.startActivity(smsto);
    }
}

```

### MainActivity.java

```java
package {{PACKAGE_NAME}};

//{{PACKAGE_NAME}} gets replaced with the package name of the app e.g com.wjs.test.packages

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
//{{PACKAGE_NAME}} gets replaced with the package name of the app e.g com.wjs.test.packages therefore pointing to WebAppInterface.java above

public class MainActivity extends AppCompatActivity{

    final Activity activity =  this;

    WebView webview;



    Resources resources;
    String WEBSITE_URL = "file:///android_asset/www/index.html";
    String url;
    Context context;

    @Override
    public void onCreate(Bundle savedInstance){
        super.onCreate(savedInstance);

        setContentView(R.layout.activity_main);

        webview = (WebView) findViewById(R.id.wv);

        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setDomStorageEnabled(true);
        webview.getSettings().setLoadsImagesAutomatically(true);

        webview.addJavascriptInterface(new WebAppInterface(this),"native");

        webview.loadUrl(WEBSITE_URL);


    }
}

```

and modules for different types of projects are stored in seperate locations

* `Java` modules are stored in `resources/java`
* `Javascript` modules are stored in `resources/WTS`
* `Typescript` modules are stored in `resources/Typescript`

## The module.conf file

module.conf is a configuration file for your module.
current fields are:
* `name`: this is an alias for your module (Only use this in taskRunners)
* `type`: this is the type of your module, module types include.
    - `task`: this is to specify a task runner.
    - `module-js`: this specifies a javascript module.
    - `module-ts`: this specifies a typescript module.
    - `module-rx`: this specifies a react-js module.
    - `module-vue`: this specifies a vue-js module.
    - `module-java`: this specifies a java module.
* `engine`: this is the main file for your module (Only use this for task runners)
* `requires`: this is the minimum update version your module needs to run

### Examples

#### Module

Configuration file.

```conf
requires = <update-version>
```

#### Task

Configuration file

```conf
name = <alias>
type = task
engine = <relative-path-to-file>
#version requirements if any
requires = <update-version?>
```

Engine file

```js
/**
 * utils contains the wjs utility object
 * cwd is the directory the task is running in
 * args is the command line arguments converted to an object e.g the arguments of
 * wjs run <your-task> --print --text="Hello World" will be {print:true,text:"Hello World"}
 */
module.exports = function(utils,cwd,args){
    console.log("Hi i am running in "+cwd+" and the option print is "+args.print+" with text as "+args.text);
}
```

## Package and publish

Run `wjs publish <name> --type=<type>` where name is the folder the module code is in and type is the type of module (`taskEngine` for task and `module` for a module)
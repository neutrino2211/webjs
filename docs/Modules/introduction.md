# How to make wjs-cli modules

## Step1 create folder

The name of this folder has to be in a specific format. The format is update-`wjs-cli target version (replace . with -)`_`update name e.g (AndroidFSWebviewPlugin)`, so for an update named `AndroidFSPlugin` targeting wjs-cli@0.1.3 the folder name will be `update-0-1-3_AndroidFSPlugin`

## Step2 create install.js file

wjs-cli executes the install.js file included in the folder.

Create the install.js file in the folder

So if the module is to change the AndroidWebview source code to include fs features, you add the new source code to the folder created above e.g "NewWJSSource.java" and in the install.js add this code

```javascript
var path = require("path");

global.unpackTo(path.join(__dirname,"NewWJSSource.java"),"resources/java/WebAppInterface.java")
```

NB: wjs-cli uses placeholders in `MainActivity.java` and `WebAppInterface.java` to assign package names to android apps so any where the app package name is required use `{{PACKAGE_NAME}}` e.g

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
* `Vue` and `React` modules are stored in `resources/vue-modules`

## module.conf 

module.conf is a configuration file for your module.
current fields are:
* `name`: this is an alias for your module (Only use this in taskRunners)
* `type`: this is the type of your module (Use `task` for task runners)
* `engine`: this is the main file for your module (Only use this for task runners)
* `requires`: this is the minimum update version your module needs to run 

### Examples

#### Module

Configuration file.

```conf
requires = <update-version>
```
Install.js

```js
var path = require("path");

global.unpackTo(path.join(__dirname,"myModule.js"),"resources/module-type-directory/myModule.js")
```

#### Task

Configuration file

```conf
name = <alias>
type = "task"
engine = <relative-path-to-file>
#version requirements if any
requires = <update-version?>
```

Engine file

```js
/**
 * cwd is the directory the task is running in
 * args is the command line arguments converted to an object e.g the arguments of
 * wjs run <your-task> --print --text="Hello World" will be {print:true,text:"Hello World"}
 */
module.exports = function(cwd,args){
    console.log("Hi i am running in "+cwd+" and the option print is "+args.print+" with text as "+args.text);
}
```

## Package and publish

Run `wjs publish <name>` where name is the folder the module code is in
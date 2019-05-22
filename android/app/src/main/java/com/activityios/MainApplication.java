package com.activityios;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.benwixen.rnfilesystem.RNFileSystemPackage;
import com.sensormanager.SensorManagerPackage;
import com.github.reactnativecommunity.location.RNLocationPackage;
import org.capslock.RNDeviceBrightness.RNDeviceBrightness;
import com.sensors.RNSensorsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFileSystemPackage(),
            new SensorManagerPackage(),
            new RNLocationPackage(),
            new RNDeviceBrightness(),
            new RNSensorsPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

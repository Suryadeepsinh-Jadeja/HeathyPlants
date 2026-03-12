# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep TFLite and Fast TFlite
-keep class org.tensorflow.** { *; }
-keep class com.mrousavy.camera.** { *; }
-keep interface org.tensorflow.** { *; }
-keep class com.facebook.react.bridge.** { *; }

# Keep Fast TFLite JNI
-keep class com.nicolo.tflite.** { *; }

# Keep react-native-permissions
-keep class com.zoontek.rnpermissions.** { *; }

# Keep react-native-screens
-keep class com.swmansion.rnscreens.** { *; }

# Keep react-native-svg
-keep class com.horcrux.svg.** { *; }

# Keep react-native-linear-gradient
-keep class com.BV.LinearGradient.** { *; }

# Keep react-native-image-picker
-keep class com.imagepicker.** { *; }

# Keep react-native-safe-area-context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Keep react-native-gesture-handler
-keep class com.swmansion.gesturehandler.** { *; }

# Keep react-native-async-storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep react-native-view-shot
-keep class fr.greweb.reactnativeviewshot.** { *; }

# Keep react-native-share
-keep class cl.json.** { *; }

# Keep react-native-fs
-keep class com.rnfs.** { *; }

# Keep react-native-vector-icons
-keep class com.oblador.vectoricons.** { *; }

# Keep Hermes
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep React Native JNI
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keepclasseswithmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip <fields>;
}
-keepclasseswithmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip <methods>;
}

# Keep all React Native native modules (broad safety net)
-keepnames class * extends com.facebook.react.bridge.ReactContextBaseJavaModule
-keepclassmembers class * extends com.facebook.react.bridge.NativeModule {
    @com.facebook.react.bridge.ReactMethod <methods>;
}

# Prevent R8 from stripping interface info needed for native module registration
-keepclassmembers,allowobfuscation class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

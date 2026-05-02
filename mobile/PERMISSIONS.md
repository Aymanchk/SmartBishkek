# Native permissions setup

Run `flutter create .` inside `mobile/` first to scaffold native projects, then add the following permissions.

## Android — `android/app/src/main/AndroidManifest.xml`

Inside `<manifest>`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

For HTTP traffic to a local Django dev server, add to `<application>`:
```xml
android:usesCleartextTraffic="true"
```

## iOS — `ios/Runner/Info.plist`

```xml
<key>NSCameraUsageDescription</key>
<string>Нужен доступ к камере для фотографий проблем</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Нужны GPS-координаты места проблемы</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Доступ к галерее для выбора фото</string>
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

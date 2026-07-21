# Сборка APK (Android)

Проверенная процедура локальной сборки релизного APK.

## Требования
- **JDK 21** (подходит JBR из Android Studio: `C:\Program Files\Android\Android Studio\jbr`).
  JDK 23 не годится — Gradle падает.
- **Android SDK** с платформой **android-35** и build-tools 35.x.
  Установить платформу (legacy `sdkmanager` требует **JRE 8**):
  ```
  set JAVA_HOME=C:\Program Files\Java\jre1.8.0_351
  "%LOCALAPPDATA%\Android\Sdk\tools\bin\sdkmanager.bat" "platforms;android-35"
  ```

## ⚠️ Путь без пробелов (важно!)
NDK/CMake (react-native-reanimated) **не собираются, если в пути есть пробел**
(`...\Saved Games\...` ломает ninja). Собирайте из каталога без пробелов —
например, скопировав проект в `C:\walley-build`:
```
robocopy "C:\...\walley" "C:\walley-build" /MIR /MT:16 /XD ".git" ".cxx" ".gradle"
```

## Шаги
```bash
cd C:\walley-build
npx expo prebuild --platform android --no-install

# путь к SDK
echo sdk.dir=C:/Users/<user>/AppData/Local/Android/Sdk > android\local.properties

# выровнять Compose-компилятор с Kotlin, который пинит React Native (иначе
# :expo-modules-core:compileReleaseKotlin падает на проверке совместимости)
echo android.kotlinVersion=1.9.24 >> android\gradle.properties

cd android
set ANDROID_HOME=C:\Users\<user>\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

APK: `android/app/build/outputs/apk/release/app-release.apk`

> Собирается только под `arm64-v8a` (все современные телефоны). Для 32-битных
> устройств добавьте `armeabi-v7a` в `-PreactNativeArchitectures`.
> Сборка подписана debug-ключом — годится для сайдлоада/тестов, не для Google Play.

## Альтернатива: облако (EAS)
Без локального SDK:
```
npm i -g eas-cli
eas login
eas build -p android --profile preview   # profile с buildType "apk"
```

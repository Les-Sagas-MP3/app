# Les Sagas MP3 - App
[![Release](https://github.com/les-sagas-mp3/app/workflows/Release/badge.svg)](https://github.com/les-sagas-mp3/app/actions?query=workflow%3ARelease)
[![Integration](https://github.com/les-sagas-mp3/app/workflows/Integration/badge.svg)](https://github.com/les-sagas-mp3/app/actions?query=workflow%3AIntegration)

## Build for Android locally

1. Put the `google-services.json` file in `android/app` folder
2. Adapt the `src/assets/config.json` file to your environment
3. Run the following commands :

```bash
export CAPACITOR_ANDROID_STUDIO_PATH="<Location to Android Studio binary>" 
npm install
ionic build
npx cap copy
npx cap open android
```

4. Use Android Studio to build and deploy

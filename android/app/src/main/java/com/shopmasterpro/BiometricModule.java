// android/app/src/main/java/com/shopmasterpro/BiometricModule.java
package com.shopmasterpro;

import android.os.Build;
import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.concurrent.Executor;

/**
 * Biometric Authentication Native Module (Android)
 *
 * Interview: Explain native module workflow
 * Answer:
 * 1. Extend ReactContextBaseJavaModule
 * 2. Override getName() - module name in JS
 * 3. @ReactMethod annotation for exposed methods
 * 4. Use Promise for async callbacks
 * 5. Register in ReactPackage
 */

public class BiometricModule extends ReactContextBaseJavaModule {

    private static final String MODULE_NAME = "BiometricModule";

    public BiometricModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * Check if biometric authentication is available
     */
    @ReactMethod
    public void isAvailable(Promise promise) {
        try {
            BiometricManager biometricManager = BiometricManager.from(getReactApplicationContext());
            int canAuthenticate = biometricManager.canAuthenticate(
                    BiometricManager.Authenticators.BIOMETRIC_STRONG |
                            BiometricManager.Authenticators.DEVICE_CREDENTIAL
            );

            switch (canAuthenticate) {
                case BiometricManager.BIOMETRIC_SUCCESS:
                    promise.resolve(true);
                    break;
                case BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE:
                    promise.reject("NO_HARDWARE", "No biometric hardware available");
                    break;
                case BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE:
                    promise.reject("HW_UNAVAILABLE", "Biometric hardware unavailable");
                    break;
                case BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED:
                    promise.reject("NONE_ENROLLED", "No biometric enrolled");
                    break;
                default:
                    promise.reject("UNKNOWN", "Unknown error");
                    break;
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    /**
     * Authenticate user with biometrics
     */
    @ReactMethod
    public void authenticate(String title, String subtitle, Promise promise) {
        FragmentActivity activity = (FragmentActivity) getCurrentActivity();

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity not found");
            return;
        }

        Executor executor = ContextCompat.getMainExecutor(activity);

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle(title)
                .setSubtitle(subtitle)
                .setAllowedAuthenticators(
                        BiometricManager.Authenticators.BIOMETRIC_STRONG |
                                BiometricManager.Authenticators.DEVICE_CREDENTIAL
                )
                .build();

        BiometricPrompt biometricPrompt = new BiometricPrompt(
                activity,
                executor,
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        promise.reject("AUTH_ERROR", errString.toString());
                    }

                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        promise.resolve(true);
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                        promise.reject("AUTH_FAILED", "Authentication failed");
                    }
                }
        );

        biometricPrompt.authenticate(promptInfo);
    }
}

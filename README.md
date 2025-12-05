# 🛍️ React Native Offline-First E-Commerce App

<div align="center">

[![React Native](https://img.shields.io/badge/React%20Native-0.73.2-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0.1-purple.svg)](https://redux-toolkit.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**A production-grade React Native application demonstrating best practices, offline-first architecture, biometric authentication, and comprehensive mobile development patterns.**

[Features](#-features) • [Installation](#-installation) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📱 About

**ShopMaster Pro** is a full-featured e-commerce mobile application built with React Native, designed as a comprehensive learning resource and production-ready template. It showcases **70+ advanced React Native concepts** from fundamentals to expert-level implementations.

### 🎯 Perfect For

- **Learning React Native** - Complete implementation from basics to advanced
- **Interview Preparation** - Covers common interview questions and patterns
- **Production Reference** - Real-world architecture and best practices
- **Portfolio Projects** - Showcase your React Native expertise

---

## ✨ Features

### 🔥 Core Features

- **🌐 Offline-First Architecture** - Works seamlessly without internet connection
- **🔐 Biometric Authentication** - Face ID, Touch ID, Fingerprint support
- **🔗 Deep Linking** - Universal links and custom URL schemes
- **🎨 Dynamic Theming** - Auto dark/light mode based on device settings
- **🛒 Shopping Cart** - Persistent cart with offline support
- **🔍 Real-time Search** - Debounced search with autocomplete
- **♾️ Infinite Scroll** - Optimized pagination and lazy loading
- **📱 Native Modules** - Custom Java/Kotlin & Objective-C/Swift modules
- **🎭 Advanced Animations** - React Native Reanimated implementations
- **📊 State Management** - Redux Toolkit with Redux Persist

### 🛠️ Technical Features

#### **Phase 1: Fundamentals**
- ✅ Component Lifecycle (Hooks: useEffect, useLayoutEffect, useMemo, useCallback)
- ✅ State Management (useState, useReducer, Context API, Redux Toolkit)
- ✅ Props & Data Flow (TypeScript interfaces, prop drilling solutions)
- ✅ Advanced Styling (Flexbox, responsive design, platform-specific styles)
- ✅ React Navigation v6+ (Stack, Tab, Drawer, nested navigation)
- ✅ Optimized Lists (FlatList with performance optimizations)
- ✅ Form Management (Formik + Yup validation)

#### **Phase 2: Advanced Concepts**
- ✅ Native Module Development (Android: Java/Kotlin, iOS: Objective-C/Swift)
- ✅ Platform-Specific Code (Conditional rendering, Platform.select)
- ✅ Performance Optimization (React.memo, virtualization, bundle analysis)
- ✅ Memory Management (Cleanup, leak prevention)
- ✅ Thread Management (JS thread, main thread, shadow thread)

#### **Phase 3: Production Features**
- ✅ Offline Sync Strategy (Request queuing, conflict resolution)
- ✅ Network State Management (NetInfo integration)
- ✅ Error Boundaries & Error Handling
- ✅ Caching Strategies (Image caching, API response caching)
- ✅ Deep Linking Configuration (URL schemes, universal links)
- ✅ Biometric Authentication (Native module implementation)
- ✅ Auto-Switching Tabs (Scroll-based tab switching)

#### **Phase 4: Architecture & Tools**
- ✅ Clean Architecture Patterns
- ✅ Type-Safe Navigation
- ✅ API Client with Interceptors
- ✅ Middleware (Offline queue, sync middleware)
- ✅ Custom Hooks (Network status, biometric, theme, debounce)
- ✅ Modular Project Structure

---

## 🏗️ Architecture

┌─────────────────────────────────────────────────────┐
│ Presentation Layer │
│ (Screens, Components, Navigation, Theme) │
└─────────────────┬───────────────────────────────────┘
│
┌─────────────────▼───────────────────────────────────┐
│ Business Layer │
│ (Redux Store, Slices, Middleware, Hooks) │
└─────────────────┬───────────────────────────────────┘
│
┌─────────────────▼───────────────────────────────────┐
│ Data Layer │
│ (API Services, Storage, Database, Native Modules) │
└─────────────────────────────────────────────────────┘

### Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native 0.73.2 |
| **Language** | TypeScript 5.3.3 |
| **State Management** | Redux Toolkit + Redux Persist |
| **Navigation** | React Navigation v6 |
| **Forms** | Formik + Yup |
| **Animations** | React Native Reanimated 3 |
| **API** | Axios with Interceptors |
| **Storage** | AsyncStorage |
| **Network** | NetInfo |
| **UI Icons** | React Native Vector Icons |


This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

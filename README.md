# Away Mission: AI Page-Agent WebView

This project is a React Native mobile application built with Expo that implements a web-based GUI agent inside a native WebView.

## Description

The project is structured into two main phases:

*   **Phase 1 (Base Camp WebView):** A custom React Native interface that includes a URL input bar and a `WebView` component. It defaults to loading `https://www.ifixit.com` and allows users to browse any standard website within the mobile app.
*   **Phase 2 (AI Integration using page-agent):** Enhances the WebView by injecting the [page-agent](https://cdn.jsdelivr.net/npm/page-agent@1.5.2/dist/iife/page-agent.js) script into the loaded web page. A secondary command bar is provided to send natural language instructions to the AI agent, allowing it to interact directly with the webpage's DOM.

## Setup Instructions

To run this project locally, ensure you have Node.js and the Expo CLI installed. 

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MOHAMMEDALMASHHOR/Web_View_App_Odevi.git
    cd Web_View_App_Odevi
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the application:**
    ```bash
    npx expo start
    ```
    Scan the QR code printed in the terminal using the Expo Go application on your mobile device.

## Classroom Deliverables

Below are the required submission materials for this assignment:

*   **APK Download Link:** [Insert APK Link Here]
*   **YouTube Demonstration Video:** [Insert YouTube Link Here]
*   **Kullanıcı Geri Bildirim Raporu (User Feedback Report):** [Insert Report Link Here]

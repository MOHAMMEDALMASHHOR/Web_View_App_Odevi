import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [urlInput, setUrlInput] = useState('https://www.ifixit.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.ifixit.com');
  const [commandInput, setCommandInput] = useState('');

  const webviewRef = useRef(null);

  const handleLoadUrl = () => {
    let finalUrl = urlInput;
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    setCurrentUrl(finalUrl);
  };

  const INJECTED_JAVASCRIPT = `
    (function() {
      // Prevent multiple injections
      if (window.__pageAgentInjected) return;
      window.__pageAgentInjected = true;

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/page-agent@1.5.4/dist/iife/page-agent.demo.js';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      // Global listener for safety fallback
      window.addEventListener('message', function(event) {
        try {
          if (event.data && event.data.type === 'execute-page-agent') {
            const command = event.data.command;
            if (window.PageAgent && typeof window.PageAgent.run === 'function') {
              window.PageAgent.run(command);
            } else if (typeof window.pageAgent === 'function') {
               window.pageAgent(command);
            }
          }
        } catch(e) {}
      });
    })();
    true;
  `;

  const handleSendCommand = () => {
    if (!commandInput.trim()) return;

    // Attempt several possible generic initialization patterns based on typical library exports
    const sanitizedCommand = commandInput.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const jsToInject = `
      try {
        const cmd = "${sanitizedCommand}";
        let executed = false;
        
        // Try global instance
        if (window.PageAgent) {
          if (typeof window.PageAgent.run === 'function') {
            window.PageAgent.run(cmd);
            executed = true;
          } else if (typeof window.PageAgent === 'function') {
            const agent = new window.PageAgent();
            if (agent.run) {
              agent.run(cmd);
              executed = true;
            }
          }
        } else if (typeof window.pageAgent === 'function') {
          window.pageAgent(cmd);
          executed = true;
        }
        
        if (!executed) {
          // Fallback message dispatch
          window.postMessage({ type: 'execute-page-agent', command: cmd }, '*');
          window.dispatchEvent(new CustomEvent('page-agent-command', { detail: cmd }));
        }
      } catch (err) {
        console.error("Error executing command against page-agent", err);
      }
      true;
    `;

    webviewRef.current?.injectJavaScript(jsToInject);
    setCommandInput('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Phase 1: Base Camp UI - URL Bar */}
        <View style={styles.headerBar}>
          <TextInput
            style={styles.input}
            placeholder="Enter URL"
            value={urlInput}
            onChangeText={setUrlInput}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <TouchableOpacity style={styles.button} onPress={handleLoadUrl}>
            <Text style={styles.buttonText}>Load</Text>
          </TouchableOpacity>
        </View>

        {/* Phase 2: AI Integration Setup - Command Bar */}
        <View style={styles.commandBar}>
          <TextInput
            style={[styles.input, styles.commandInput]}
            placeholder="Ask AI agent to interact with page..."
            value={commandInput}
            onChangeText={setCommandInput}
            onSubmitEditing={handleSendCommand}
          />
          <TouchableOpacity style={styles.commandButton} onPress={handleSendCommand}>
            <Text style={styles.buttonText}>Send Command</Text>
          </TouchableOpacity>
        </View>

        {/* Phase 1: Base Camp WebView */}
        <View style={styles.webviewContainer}>
          <WebView
            ref={webviewRef}
            source={{ uri: currentUrl }}
            style={styles.webview}
            injectedJavaScript={INJECTED_JAVASCRIPT}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={(event) => {
              // Can handle messages from WebView here
              // console.log("Message from WebView:", event.nativeEvent.data);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 30 : 10,
  },
  commandBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#e9ecef',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    fontSize: 16,
  },
  commandInput: {
    borderColor: '#adb5bd',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  commandButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

/**
 * Server Health Check Utility
 * Use this to diagnose server connectivity issues
 */

export async function checkServerHealth() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🔍 Starting server health check...');
  console.log('Target URL:', baseURL);
  
  try {
    // Simple test to see if server responds
    const response = await fetch(`${baseURL}/health`, {
      method: 'GET',
      timeout: 5000,
    });
    
    if (response.ok) {
      console.log('✅ Server is running and responding');
      return { healthy: true, message: 'Server is running' };
    } else {
      console.log('⚠️ Server responded with status:', response.status);
      return { healthy: false, message: `Server responded with status ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Server health check failed:', error);
    
    let message = 'Server is not accessible';
    
    if (error.message.includes('Failed to fetch')) {
      message = 'Cannot reach server - check if it\'s running on port 5000';
    } else if (error.message.includes('timeout')) {
      message = 'Server is not responding - it may be overloaded or crashed';
    }
    
    return {
      healthy: false,
      message,
      error: error.message
    };
  }
}

/**
 * Log detailed diagnostics about the network issue
 */
export function logNetworkDiagnostics(error) {
  console.group('🔴 Network Diagnostics');
  
  console.log('Error Type:', error?.constructor?.name);
  console.log('Error Message:', error?.message);
  
  if (error?.isAxiosError) {
    console.log('Axios Error Details:');
    console.log('  - Code:', error?.code);
    console.log('  - Status:', error?.response?.status);
    console.log('  - URL:', error?.config?.url);
    console.log('  - Base URL:', error?.config?.baseURL);
  }
  
  console.log('\n💡 Troubleshooting steps:');
  console.log('1. Check if server is running: npm run dev (in server folder)');
  console.log('2. Verify server URL: http://localhost:5000');
  console.log('3. Check firewall settings');
  console.log('4. Ensure client is on http://localhost:3000');
  console.log('5. Open DevTools > Network tab to see request details');
  
  console.groupEnd();
}

// Auto-run health check on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Run health check but don't block page
    checkServerHealth().then(result => {
      if (!result.healthy) {
        console.warn('⚠️ Server health check failed:', result.message);
      }
    });
  });
}

// Export for manual use in components
export default {
  checkServerHealth,
  logNetworkDiagnostics,
};

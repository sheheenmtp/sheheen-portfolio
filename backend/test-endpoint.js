const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBackend() {
  console.log('Testing backend endpoints...\n');

  try {
    // Test health check
    console.log('1. Testing health check endpoint...');
    const response = await fetch('http://localhost:3001/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log('   Response:', data);
    console.log('   ✓ Health check passed\n');

    // Test email validation with invalid email
    console.log('2. Testing email validation with invalid email...');
    const emailResponse = await fetch('http://localhost:3001/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        message: 'This is a test message'
      })
    });

    const emailData = await emailResponse.json();
    console.log('   Response:', emailData);
    console.log('   ✓ Validation correctly caught invalid email\n');

    // Test with valid data (should work with valid credentials)
    console.log('3. Testing with valid data (should send email successfully)...');
    const emailResponse2 = await fetch('http://localhost:3001/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from the portfolio backend'
      })
    });

    const emailData2 = await emailResponse2.json();
    console.log('   Response:', emailData2);

    if (emailData2.success) {
      console.log('   ✓ Email sent successfully! Check your inbox.\n');
    } else {
      console.log('   ✗ Email sending failed:', emailData2.message, '\n');
    }

    console.log('All tests completed!');

    if (emailData2.success) {
      console.log('\n🎉 Success! Your backend is properly configured and can send emails.');
      console.log('   Next steps:');
      console.log('   1. Check your email inbox for the test message');
      console.log('   2. Deploy your backend to make it accessible from your portfolio');
      console.log('   3. Update the frontend to use your deployed backend URL');
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testBackend();
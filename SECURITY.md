# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.1.x   | ✅ |
| < 2.0   | ❌ |

## Reporting a Vulnerability

If you discover any security issues within the project, please report them by following these guidelines:

1. **Check Existing Reports:** Before submitting, search the [GitHub Issues](https://github.com/kkMihai/virtualizorjs/issues) to see if the vulnerability has already been reported or discussed.

2. **Private Reporting:** For security vulnerabilities, please report them privately to avoid exposing the issue before a fix is available. You can:
   - Open a GitHub issue and mark it as private/security (if your GitHub account allows)
   - Or contact the maintainer directly via email (available in the maintainer's GitHub profile)

3. **Provide Details:** Clearly describe the nature of the vulnerability, including:
   - Affected components and versions
   - Steps to reproduce (if applicable)
   - Potential impact
   - Any mitigations you've identified

4. **Expectations:** We will acknowledge your report within 5 business days and strive to keep you informed of our progress toward a resolution.

5. **Resolution:** Once validated, we will work on resolving the vulnerability and publish a fix in a timely manner. We will credit you in the release notes unless you wish to remain anonymous.

6. **Public Disclosure:** We kindly request that you allow us a reasonable time to address the issue before public disclosure.

## Security Best Practices for Users

When using the VirtualizorJS SDK, follow these practices to maintain security:

- **Credential Protection:** Never expose your Virtualizor API key and password in client-side code, public repositories, or insecure logs. Use environment variables or secure secret management systems.
  
- **Principle of Least Privilege:** Use API credentials with the minimum permissions necessary for your application's functionality.

- **Input Validation:** While the SDK provides type safety, always validate and sanitize any user input before passing it to the API methods.

- **Error Handling:** Handle SDK errors appropriately to avoid leaking sensitive information in error messages to end-users.

- **Keep Updated:** Regularly update to the latest version of the SDK to benefit from security fixes and improvements.

- **Network Security:** Ensure your application communicates with the Virtualizor server over secure channels (HTTPS). The SDK defaults to HTTPS but can be configured otherwise.

## Additional Notes

- This SDK is a client library for interacting with the Virtualizor API. It does not run a server or store data persistently.
- The primary security considerations involve the protection of API credentials used to authenticate with your Virtualizor instance.
- The Virtualizor API itself may have additional security measures; please refer to Virtualizor's official documentation for server-side security configurations.
- We do not collect or transmit any usage data or credentials to third parties.

Thank you for helping us keep VirtualizorJS secure!

`Disclaimer: written by an LLM Model (GLM-5)`
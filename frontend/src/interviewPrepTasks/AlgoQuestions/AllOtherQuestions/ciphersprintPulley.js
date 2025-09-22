// Define the base URL for the API
const baseUrl = 'https://ciphersprint.pulley.com';

// Unified fetcher function for API calls
async function fetcherFunction(url, headers = {}) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in fetcherFunction:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Function to remove the 'task_' prefix
const removeTask_ = (str) => str.toString().replace('task_', '');

// Function to clean non-hex characters from a string
const cleanNonHex = (str) => str.toString().replace(/[^0-9a-f]/gi, '');

function rotateLeft(str1, n) {
  var temp = str1 + str1;
  var l1 = str1.length;

  var Lfirst = temp.substr(n, l1);

  //     now returning string
  return Lfirst;
}

function xorDecrypt(hexEncodedStr, key) {
  // Step 1: Decode the hex-encoded string to get the byte data
  const byteArray = hexToByteArray(hexEncodedStr);

  // Step 2: Convert the key to a byte array
  const keyBytes = new TextEncoder().encode(key);

  // Step 3: XOR the byte data with the key
  const decryptedBytes = byteArray.map(
    (byte, i) => byte ^ keyBytes[i % keyBytes.length]
  );

  // Step 4: Convert the decrypted bytes to a string
  const decryptedString = new TextDecoder().decode(
    new Uint8Array(decryptedBytes)
  );

  return decryptedString;
}

function hexToByteArray(hex) {
  const byteArray = [];
  for (let i = 0; i < hex.length; i += 2) {
    byteArray.push(parseInt(hex.substr(i, 2), 16));
  }
  return byteArray;
}

// Main function to orchestrate the API calls and processing
async function makeApiCalls() {
  try {
    // Fetch the first API response
    const initialUrl = `${baseUrl}/viktor.sheverdin@gmail.com`;
    const firstData = await fetcherFunction(initialUrl, {
      'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language':
        'en-CA,en;q=0.9,ru-RU;q=0.8,ru;q=0.7,en-GB;q=0.6,en-US;q=0.5',
      'Cache-Control': 'max-age=0',
      'Priority': 'u=0, i',
      'Sec-CH-UA':
        '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    });

    const encryptedPath = firstData.encrypted_path.trim();

    // Fetch the second API response using the encrypted path
    const secondUrl = `${baseUrl}/${encryptedPath}`;
    const secondData = await fetcherFunction(secondUrl);

    // Translate ASCII codes to a string
    const asciiString = secondData.encrypted_path;
    const asciiArray = asciiString.match(/\d+/g) || [];
    const translatedString = asciiArray
      .map((code) => String.fromCharCode(code))
      .join('');

    // Fetch the third API response
    const thirdUrl = `${baseUrl}/task_${translatedString}`;
    const thirdData = await fetcherFunction(thirdUrl);
    const cleanedHex = cleanNonHex(removeTask_(thirdData.encrypted_path)); // Replace `someField` with the actual field if needed

    const fourthUrl = `${baseUrl}/task_${cleanedHex}`;
    const fourthData = await fetcherFunction(fourthUrl);
    console.log('Fourth API response:', fourthData);

    const stringForTaskFive = removeTask_(fourthData.encrypted_path);
    const rotationAmount = parseInt(
      `${fourthData.encryption_method}`?.match(/(\d+)$/)[1],
      10
    );
    console.log('String for task five:', stringForTaskFive);
    console.log('Rotation amount:', rotationAmount);
    const rotatedString = rotateLeft(stringForTaskFive, rotationAmount);
    console.log(rotatedString);

    const fifthUrl = `${baseUrl}/task_${rotatedString}`;
    const fifthData = await fetcherFunction(fifthUrl);
    console.log('Fifth API response:', fifthData);

    const decryptedPath = xorDecrypt(encryptedPath, 'secret');
    console.log('Decrypted path:', decryptedPath);

    const sixthUrl = `${baseUrl}/${decryptedPath}`;
    const sixthData = await fetcherFunction(sixthUrl);
    console.log('Sixth API response:', sixthData);
    //
  } catch (error) {
    // Handle any errors that occurred during the API calls
    console.error('Error in makeApiCalls:', error);
  }
}

// Call the main function to execute the logic
makeApiCalls();

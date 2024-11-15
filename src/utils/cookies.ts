export const setCookie = (name: string, value: string, days: number = 365) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };
  
  export const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
  
    // Use optional chaining to ensure ca[i] is not undefined
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]?.trim();  // Optional chaining to check for undefined or null
  
      if (c && c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    
    return null;
  };
  
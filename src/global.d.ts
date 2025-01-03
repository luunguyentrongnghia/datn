declare global {
  interface Window {
    confirmationResult: {
      confirm: (otp: string) => Promise<any>;
    };
  }
}

export {}; // Để đảm bảo TypeScript coi đây là module

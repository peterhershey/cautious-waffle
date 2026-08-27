/* Pre-baked figlet banner (font: standard) for the one-time kickoff title.
   Stored as a static array so server and client render identically — no
   runtime figlet, no hydration mismatch. Generated via pyfiglet. */

export const BANNER_PETER: string[] = [
  " ____  _____ _____ _____ ____  ",
  "|  _ \\| ____|_   _| ____|  _ \\ ",
  "| |_) |  _|   | | |  _| | |_) |",
  "|  __/| |___  | | | |___|  _ < ",
  "|_|   |_____| |_| |_____|_| \\_\\"
];

export const BANNER_HERSHEY: string[] = [
  " _   _ _____ ____  ____  _   _ _______   __",
  "| | | | ____|  _ \\/ ___|| | | | ____\\ \\ / /",
  "| |_| |  _| | |_) \\___ \\| |_| |  _|  \\ V / ",
  "|  _  | |___|  _ < ___) |  _  | |___  | |  ",
  "|_| |_|_____|_| \\_\\____/|_| |_|_____| |_|  "
];

// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    accentColor: string;
    boxColor: string;
    subColor: string;
    upColor: string;
    downColor: string;
  }
}

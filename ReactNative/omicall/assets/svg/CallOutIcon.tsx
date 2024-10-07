import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CallOutIcon(props: any) {
  return (
    <Svg
      height={22}
      viewBox="0 0 24 24"
      width={22}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M17.625 14.174l2.642 1.576a1.5 1.5 0 01.7 1.583 4.527 4.527 0 01-5.6 3.509A17.441 17.441 0 013.159 8.635a4.526 4.526 0 013.507-5.6h.016a1.5 1.5 0 011.587.708l1.564 2.633A2.051 2.051 0 019.2 9.128l-1.657 1.105a11.6 11.6 0 006.211 6.226l1.115-1.665a2.052 2.052 0 012.756-.62zm3.067-10.461a.75.75 0 00-.406-.405A.742.742 0 0020 3.25h-3.333a.75.75 0 100 1.5h1.522L14.47 8.47a.75.75 0 101.06 1.06l3.72-3.719v1.522a.75.75 0 001.5 0V4a.751.751 0 00-.058-.287z"
        fill="#fff"
      />
    </Svg>
  );
}

export default CallOutIcon;

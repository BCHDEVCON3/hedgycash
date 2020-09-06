import React from 'react';

import loading from './assets/loading.gif';

const Loading = ({ ...props }) => (
    <img {...props} src={loading} alt="loading..." width="200" height="200" />
);

export default Loading;

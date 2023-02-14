import React from 'react';

type CliProps = {
    url: string;
    token: string;
};
declare const RedisCli: React.FC<CliProps>;

export { CliProps, RedisCli };

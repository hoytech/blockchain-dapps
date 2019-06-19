import React from 'react';

const networkNameLookup = {
    1: 'mainnet',
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
    42: 'kovan',
};

export function useWeb3(opts) {
    let [state, setState] = React.useState({ status: 'LOADING', });
    let initedRef = React.useRef();

    let determineStatus; determineStatus = async () => {
        let getAccount = () => {
            let address = window.web3.eth.accounts[0].toLowerCase();
            let networkId = window.web3.version.network;
            let networkName = networkNameLookup[networkId] || `unknown(${networkId})`;

            return { address, networkId, networkName, };
        };

        let installState = (status, extra) => {
            if (status === 'READY') {
                let account = getAccount();
                if (status !== state.status || JSON.stringify(account) !== JSON.stringify(state.account)) {
                    setState({ status, account, ...extra, });
                }
            } else {
                if (status !== state.status) {
                    setState({ status, ...extra, });
                }
            }
        };

        if (!window.web3) return installState('NO_WEB3');

        if (window.web3.eth.accounts.length > 0) return installState('READY');

        if (window.ethereum) {
            let enable = async () => {
                try {
                    await window.ethereum.enable();
                } catch(e) {
                    if (opts.onEnableError) opts.onEnableError(e);
                    else console.log("Enable error: " + e);
                }

                determineStatus();
            };

            if (window.ethereum._metamask) {
                let isUnlocked = await window.ethereum._metamask.isUnlocked();
                if (!isUnlocked) return installState('LOCKED', { enable, });

                let isApproved = await window.ethereum._metamask.isApproved();
                if (!isApproved) return installState('NOT_ENABLED', { enable, });

                await enable();
            } else {
                return installState('NOT_ENABLED', { enable, });
            }
        } else {
            // Old dApp browsers without window.ethereum
            return installState('LOCKED');
        }
    };

    if (!initedRef.current) {
        initedRef.current = true;
        determineStatus();
    }

    React.useEffect(() => {
        let intervalHandle = setInterval(determineStatus, 1000);
        return () => clearInterval(intervalHandle);
    });

    return state;
}

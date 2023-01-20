import React, { useEffect, useState } from "react";
import ReceiveSharingIntentModule from "react-native-receive-sharing-intent";

export default useGetShare = () => {

    const [file, setFile] = useState()

    useEffect(() => {

        ReceiveSharingIntentModule.getReceivedFiles(
            files => {
                if (files) {
                    setFile(files[0])
                }
            },
            error => {}
        );

    }, [])

    return file
}
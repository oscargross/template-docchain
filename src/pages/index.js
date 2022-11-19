import React, { useEffect, useState, useContext } from 'react';
import CardSBT from '../components/CardSBT';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getSBT, newRegister, editRegister, deleteRegister } from '../services/firebase';
import { Web3Context } from '../contexts/web3-context';
export default () => {

  const [sbts, setSbts] = useState([])
  const { account, chainId } = useContext(Web3Context)

  useEffect(() => {
    const getSBTs = async () => {
      await getSBT(account).then(setSbts).catch(setSbts)
    }
    getSBTs()
  }, [chainId, account])

  return (
    <Box sx={{
      flexGrow: 1, marginTop: 15, marginLeft: 15
    }}>
      <Grid container spacing={{ xs: 7, sm: 7, md: 7 }} columns={{ xs: 8, sm: 8, md: 8 }} >
        {sbts?.map((sbt, i) => (
          <Grid item
            key={i}>
            <CardSBT sbt={sbt} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

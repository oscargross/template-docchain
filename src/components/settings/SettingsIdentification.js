import { useState, useContext, useEffect } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, TextField, Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';
import { Web3Context } from '../../contexts/web3-context';
import { getNameByAddr, setNameAddr } from '../../services/firebase';
import { wordsError } from '../../utils/converter';

export default () => {

  const { account, chainId } = useContext(Web3Context)
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('')
  const [openSnack, setOpenSnack] = useState(false)
  const [msgError, setMsgError] = useState()
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [loading, setLoading] = useState(false)

  const getName = async () => {
    const nameAccount = await getNameByAddr(account)
    setName(nameAccount)
  }

  useEffect(() => {
    setNewName()
    getName()
  }, [account, chainId])

  const changeName = async () => {
    setOpenBackdrop(true)
    setLoading(true)

    try {
      if (newName.trim() === name) throw Error('Invalid same name!');
      await setNameAddr(account, newName.trim())
      setOpenSnack(true);
      getName()
      setNewName()
    } catch (error) {
      console.error(error?.message)
      setMsgError(wordsError(error?.message))
      setOpenSnack(true);

    }
    setOpenBackdrop(false)

    setLoading(false)

  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  return (<>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openBackdrop}
      onClick={() => setOpenBackdrop(false)}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    <Snackbar
      open={openSnack}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      {msgError ? <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>{msgError}</Alert>
        : <Alert severity="success" onClose={handleClose} sx={{ width: '100%' }} >Change performed successfully!</Alert>
      }
    </Snackbar>
    <form>
      <Card>
        <CardHeader
          subheader="Update name and email"
          title="Identification"
        />
        <Divider />
        <CardContent>
          <TextField
            helperText={name ? `Your current name is: ${name}` : ''}
            fullWidth
            label="Name"
            margin="normal"
            name="name"
            onChange={({ target: { value } }) => setNewName(value)}
            type="text"
            value={newName ? newName : ''}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="email"
            margin="normal"
            name="email"
            type="text"
            value={''}
            variant="outlined"
            disabled
          />
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            disabled={loading && true}
            color="primary"
            variant="contained"
            onClick={changeName}
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
  </>
  );
};

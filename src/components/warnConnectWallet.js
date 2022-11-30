import ArrowOutwardTwoToneIcon from '@mui/icons-material/ArrowOutwardTwoTone';
import { Typography, Link, CardContent, Card, Box } from '@mui/material';

export const WarnConnectWallet = () => {

  return (
    <Box
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        width: '100%',
        margin: 10,
        justifyContent: 'center',
      }}
    >
      <Card sx={{ minWidth: 300, alignSelf: 'center', textAlign: 'center' }} elevation={15}>
        <CardContent >
          <Typography gutterBottom variant="h5" component="div">
            Connect your wallet <ArrowOutwardTwoToneIcon fontSize="large" />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Don't have a wallet yet? Download the extension <Link rel="noopener noreferrer" target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=pt-br">Metamask</Link> and follow the <Link rel="noopener noreferrer" target="_blank" href="https://portaldobitcoin.uol.com.br/o-passo-a-passo-para-criar-e-usar-uma-carteira-metamask/">tutorial</Link>.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

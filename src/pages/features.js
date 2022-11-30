import Head from 'next/head';
import {
  Box,
  Typography,
  Container
} from '@mui/material';
import CardFeature from '../components/features/CardFeature';

export default () => {

  return (
    <>
      <Head>
        <title>
          Features
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
           <Container maxWidth="lg">
        <Typography
          sx={{ mb: 3 }}
          variant="h4"
        >
          Features
        </Typography>
          <Box sx={{ pt: 3 }}>
            <CardFeature label={'MultSign Docs'}
              text={'Have you ever thought about signing documents and contracts via blockchain technology?'}
              text2={'This will be possible by creating SBTs that will be minted in the contract only after a specific number of wallet signatures. This information will be informed at the time of creation of the SBT on hold and will facilitate the agreement on contracts of many companies and individuals.'}
            />            
            
            <CardFeature label={'Swap of tokens'} text={'Will I always need to have ETH in my wallet?'} 
              text2={'It will be possible to buy the issuance of SBTs with a credit card or transfer from your conditional bank. In this way, Docchain is responsible for issuing the collections and paying the network fees. We will remove this token exchange part to make the platform easier to use.'}
            />

            <CardFeature label={'Diversified permission to collections'} text={"What if I don't want to make all my collections public?"} 
              text2={'Through encryption, desired collections can become visible only to you or a list of wallets that you decide when you want. Your diversification and privacy of collections will be noticed.'}
            />

            <CardFeature label={'File sharing'} text={'I want my CV with better visualization!'} 
              text2={"It will be possible to find profiles and select the relevant documents and issue a file with the portfolio summary and data. Much easier for headhunter, isn't it?"}
            />

          </Box>
        </Container>
      </Box>
    </>

  )
}


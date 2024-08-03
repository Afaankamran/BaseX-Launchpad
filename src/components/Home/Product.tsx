import Images from '@/public/Assets/Images';
import Image from 'next/image';
import React from 'react';
import { Box, Grid, Container, Stack, Typography } from '@mui/material';
import ProductsCard from './Card/productCard';

const Product = () => {
  const cardData = [
    {
      logo: Images.heroSection3Icon1,
      title: 'Dex',
      description: `Experience lightning-fast, trustless trading on our decentralized exchange powered by Base Network. Swap tokens securely with minimal slippage and maximum efficiency.`,
      bgColor: 'bg-gradient-radial3',
    },
    {
      logo: Images.heroSection3icon2,
      title: 'Launchpad',
      description:
        'Launch your project into orbit with Base Launchpad! Access a community-driven platform for fair and transparent token launches, leveraging the power of Base Network’s security and scalability.',
      bgColor: 'bg-gradient-radial3',
    },
    {
      logo: Images.heroSection3icon3,
      title: 'Audit',
      description:
        "Integrity and security is assured with Base Audit Services. Our expert team conducts thorough audits, providing comprehensive insights and recommendations to fortify your smart contracts and protocols.",
      bgColor: 'bg-gradient-radial3',
    },
    {
      logo: Images.heroSection3icon4,
      title: 'Token Generator',
      description:
        'Create, deploy and manage tokens effortlessly with Base Token Generator. Empower innovation and tokenization with our user-friendly interface, backed by the robust infrastructure of Base Network.',
      bgColor: 'bg-gradient-radial3',
    },
    {
      logo: Images.heroSection3icon5,
      title: 'KYC Integration',
      description: "Uphold regulatory and build trust with Base KYC integration. Seamlessly verify user identities while maintaining privacy and security, ensuring a safe and compliant trading environment.",
      bgColor: 'bg-gradient-radial3',
    },
    {
      logo: Images.heroSection3icon6,
      title: 'Multisender',
      description: "Streamline token distribution with Base Multisender. Empower users to send tokens to multiple wallets in a single transaction, saving time and gas fees.",
      bgColor: 'bg-gradient-radial3',
    },
  ];
  return (
    <div>
      <Container maxWidth="lg">
        <section className=" pt-[99px]">
          <div className="text-center lg:space-y-2 w-full" >
            <div className="text-left space-y-2">
              <Box className="flex justify-start items-center w-full">
                <Typography variant="h4" fontSize="50px" fontWeight="bold">THE BaseX ADVANTAGE</Typography>
              </Box>

            </div>
            <Box display="flex" justifyContent={'center'}>
              <Typography color="text.secondary" className="text-sm ">
              </Typography>
            </Box>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-20 md:grid-cols-2 lg:grid-cols-3">
            {cardData.map((item, id) => {
              return <ProductsCard item={item} id={id} />;
            })}
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Product;

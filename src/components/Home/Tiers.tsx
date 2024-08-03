import { AKITAX_LEVELS, XAKITA_LEVELS } from '@/config';
import { useActiveWeb3React } from '@/hooks';
import RoundCard from '../RoundCard';

export default function Tiers() {
  const { chainId } = useActiveWeb3React();

  const TIERS_AKITAX = AKITAX_LEVELS[chainId] || [];
  const TIERS_XAKITA = XAKITA_LEVELS[chainId] || [];
  return (
    <div className="pt-3 pp-home-how-it-work pp-section" id="how-it-work">
      <div className="container">
        <div className="text-center row justify-cente">
          <div className="col-lg-12">
            <div className="section-head">
              <h2
                className="title title-xl"
                data-aos="fade-up"
                data-aos-delay={100}
                title="Tiered System"
              >
                THE AVAPAD TIERED SYSTEM
              </h2>
              <p data-aos="fade-up" data-aos-delay={200} className="mt-3">
                Avapad offers a public white list lottery tier, weighted lottery
                tiers and guaranteed allocation tiers.
              </p>
              <div className="mt-5 row items-center">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  {/* <img
                    src="/images/antier_expertise_ido_development.png"
                    className="w-100"
                  /> */}
                  <img src="/images/infographic.png" className="w-100" />
                </div>
                {/* <div className="col-md-8 ps-md-5 font-18 text-start">
                  <p />
                  <p>
                    <b className="white-d">5%</b> for public white list
                    lotteries (open to anyone who completes tasks, no tokens
                    required)
                  </p>
                  <p>
                    <b className="white-d">10%</b> for lottery Tiers (Earth
                    tiers)
                  </p>
                  <p>
                    <b className="white-d">85%</b> for guaranteed allocation
                    Tiers (higher tiers)
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pp-home-how-it-work-content pp-section-body">
        <div className="container">
          {/* <div className="mt-5 mb-5 text-center">
          <h3 className="text-uppercase">
            <b>PUBLIC WHITE LIST LOTTERY</b>
          </h3>
        </div>
        <p className="text-center font-20">
          5% of the IDO will be allocated to the public!, this is open to anyone
          who completes tasks, with no requirement to stake AVAPAD tokens.
        </p>
        <p className="text-center font-20">
          Follow the announcements channel to learn what to do for each project.
        </p> */}
          {/* <div className="mt-5 mb-5 text-center">
          <h3 className="text-uppercase">
            <b>LOTTERY TIER</b>
          </h3>
        </div>
        <div className="mb-3 row justify-cente">
          <div className="col-md-4" data-aos="fade-up" data-aos-delay={100}>
            <div className="text-center pricing-table">
              <p className="bold price-header">
                <b className="text-warning">Earth</b>
              </p>
              <hr />
              <p className="mb-0 light thin">Staking Requirement</p>
              <p className="bold price">
                <span>15,000</span>
              </p>
              <p className="value price">
                <span className="font-18">1 lottery ticket</span>
              </p>
              <p className="mb-0 light thin">Staking Length Required</p>
              <p className="value price">
                <span className="font-18">
                  3 hours before allocation round opens
                </span>
              </p>
              <hr />
              <a
                href="https://avapad.medium.com/avapad-avapad-the-official-launchpad-of-the-avax-blockchain-8e0c7654e0ae"
                target="blank"
                className="btn btn-primary btn-lg"
              >
                Learn more
              </a>
            </div>
          </div>
        </div> */}
          <div className="p-content-tabs">
            <Tab.Container id="stake-tiers-tabs" defaultActiveKey="akitax">
              <div className="mt-5 mb-5 text-center">
                <h3 className="text-uppercase">
                  <b>GUARANTEED ALLOCATION TIERS</b>
                </h3>
              </div>
              <Nav variant="tabs" className="mb-5 flex justify-cente">
                <Nav.Item>
                  <Nav.Link eventKey="akitax">AKITAX Tiers</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="xakita">XAKITA Tiers</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content
              // className="tab-content"
              //   id="myTabContent"
              >
                <Tab.Pane eventKey="akitax">
                  <div className="mb-3 row justify-cente">
                    {TIERS_AKITAX.map((tier) => {
                      return <RoundCard tier={tier} />;
                    })}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="xakita">
                  <div className="mb-3 row justify-cente">
                    {TIERS_XAKITA.map((tier) => {
                      return <RoundCard tier={tier} />;
                    })}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
          {/* <p className="mb-5 text-center">
          Lottery winners will be announced prior to the IDO and can purchase
          their allocation when IDO opens. All other guaranteed tiers users can
          purchase their guaranteed allocation when the IDO opens too.All
          allocations will need to be purchased in the allotted time or it will
          be forfeited and offered as first come first served.
        </p> */}
          <div className="mt-5 mb-5 text-center">
            <h3 className="text-uppercase">
              <b>Round 2 - FCFS ROUND</b>
            </h3>
          </div>
          <div className="mb-5 row items-center">
            <div className="col-md-6" data-aos="fade-up" data-aos-delay={100}>
              {/* <img src="/images/gfx-e.png" alt="" className="w-100" /> */}
              <img src="/images/fcfs.png" alt="" className="w-100" />
            </div>
            <div className="col-md-6" data-aos="fade-up" data-aos-delay={200}>
              <p>
                In round 2, the unsold tokens from the first round are made
                available on a FCFS basis, to every one. The tier members will
                get an additional amount. This round will be opened few hours
                before the sale endtime.
              </p>
              {/* <p className="mt-3">
                <b className="how-it-work-heading">
                  We will be collecting both data and feedback on the IDO
                  structure in order to optimize the system over time as well as
                  taking into consideration community feedback and potential DAO
                  proposals.
                </b>
              </p>
              <p>
                Our system is a predictable and provably fair system giving our
                users the proper incentives to accumulate and hold tokens and
                support each and every project launched. Over time, we will
                tweak weights, add new tiers and change other parameters as
                necessary to keep the system functional, competitive and
                rewarding for all community members.
              </p>
              <p>
                $AVAPAD is the next evolution of blockchain launchpads solving
                the fundamental flaws that plague existing launchpads. This
                platform benefits all holders of the token and allows for fair
                launches giving traders of all sizes the opportunity to invest
                in the best upcoming projects launching on the Avax network.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

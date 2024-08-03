import { Tier } from '@/config';

export default function RoundCard({ tier }: { tier: Tier }) {
  return (
    <div className="col-md-4" data-aos="fade-up" data-aos-delay={100}>
      <div className="pricing-table text-center">
        <p className="bold price-header">
          <b className="text-warning">{tier.level}</b>
        </p>
        <hr />
        <p className="light thin mb-0">Staking Requirement</p>
        <p className="bold price">
          <span>{tier.minAmount.toLocaleString()}</span>
        </p>
        <p className="value price">
          <span className="font-18">1 Guaranteed Allocation</span>
        </p>
        {/* <p className="light thin mb-0">Staking Length Required</p>
        <p className="value price">
          <span className="font-18">3 hours before allocation round opens</span>
        </p> */}
        <p className="light thin mb-0">Pool Weight</p>
        <p className="value price">
          <span className="font-18">{tier.allocation}%</span>
        </p>
        <hr />
        <a href="#" target="blank" className="btn btn-primary btn-lg">
          Learn more
        </a>
      </div>
    </div>
  );
}

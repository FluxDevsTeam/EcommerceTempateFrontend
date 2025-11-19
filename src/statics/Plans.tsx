import { Check, MessageCircle } from 'lucide-react';

interface CheckItemProps {
  text: string;
}

interface PricingCardProps {
  title: string;
  subtitle: string;
  features: string[];
  buttonText: string;
  isPremium: boolean;
  buttonColor: string;
  isPopular: boolean;
}

// --- Sub-Components ---

const PricingHeader = () => (
  <div className="text-center py-16 px-4 max-w-4xl mx-auto">
    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Our Pricing Plan</h1>
    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
      Our Plans Give You A Starting Point — From One-Time Design Consultations To Full Creative Transformations.
      Custom Quotes Are Available For Larger Projects And Institutions.
    </p>
  </div>
);

const CheckItem = ({ text }: CheckItemProps) => (
  <li className="flex items-start gap-3 mb-3">
    <div className="mt-0.5 min-w-[20px] min-h-[20px] rounded-full border border-[#087CA7] flex items-center justify-center text-[#087CA7]">
      <Check size={12} strokeWidth={3} />
    </div>
    <span className="text-sm text-gray-700 leading-tight">{text}</span>
  </li>
);

const PricingCard = ({ title, subtitle, features, buttonText, isPremium, buttonColor, isPopular }: PricingCardProps) => {
  return (
    <div className={`rounded-2xl p-8 flex flex-col h-full relative ${isPremium ? 'bg-[#FFFBF3] border border-[#FDB043]/30 shadow-sm' : 'bg-white border border-gray-200'}`}>
      
      {isPopular && (
        <span className="absolute top-8 right-8 bg-[#FDB043] text-white text-xs font-bold px-3 py-1 rounded-full">
          Popular
        </span>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 text-sm mb-8 min-h-[40px]">{subtitle}</p>

      <div className="mb-6">
        <h4 className="font-bold text-sm text-gray-900 mb-4">Features</h4>
        <ul className="space-y-1">
          {features.map((feature, idx) => (
            <CheckItem key={idx} text={feature} />
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <button 
          className={`w-full py-3.5 rounded-full font-semibold text-white transition-transform hover:scale-[1.02] ${
            buttonColor === 'orange' ? 'bg-[#FDB043] hover:bg-[#e59b32]' : 'bg-[#087CA7] hover:bg-[#066a8f]'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const PlansOverview = () => {
  const rows = [
    {
      plan: "Mini Makeover",
      ideal: "Parents or small play corners",
      get: "Jane Quick revamps, furniture updates, and room stylingCooper",
      price: "₦100,000 – ₦180,000"
    },
    {
      plan: "Basic",
      ideal: "Bedrooms, nurseries, and small schools",
      get: "Full interior design + furniture setup",
      price: "₦250,000 – ₦450,000"
    },
    {
      plan: "Premium Play & Learn Space",
      ideal: "Schools, daycares, or play studios",
      get: "Full design, furniture build, and installation",
      price: "₦500,000 – ₦850,000"
    },
    {
      plan: "Custom Quote",
      ideal: "Large spaces or special projects",
      get: "Custom-built kids furniture, modular setups, and space branding",
      price: "Custom Quote"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">Plans Overview</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 font-bold text-gray-900 w-1/5">Plan</th>
              <th className="py-4 font-bold text-gray-900 w-1/4">Ideal For</th>
              <th className="py-4 font-bold text-gray-900 w-1/3">What You Get</th>
              <th className="py-4 font-bold text-gray-900 w-1/5">Price Range</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className={idx !== rows.length - 1 ? "border-b border-gray-100" : ""}>
                <td className="py-6 pr-4 align-top text-gray-800 font-medium">{row.plan}</td>
                <td className="py-6 pr-4 align-top text-gray-600 leading-relaxed">{row.ideal}</td>
                <td className="py-6 pr-4 align-top text-gray-600 leading-relaxed">{row.get}</td>
                <td className="py-6 align-top text-gray-900 font-medium">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="md:hidden space-y-6">
        {rows.map((row, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="mb-4">
              <span className="text-xs font-bold text-[#087CA7] uppercase tracking-wider">Plan</span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{row.plan}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">Ideal For</span>
                <p className="text-gray-600 text-sm mt-1">{row.ideal}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">What You Get</span>
                <p className="text-gray-600 text-sm mt-1">{row.get}</p>
              </div>
              <div>
                 <span className="text-xs font-bold text-gray-400 uppercase">Price Range</span>
                 <p className="text-gray-900 font-bold mt-1">{row.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const StillDeciding = () => (
  <div className="bg-[#F9FAFB] py-16 px-6 text-center mb-12">
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <div className="mb-4 text-gray-400">
        <MessageCircle size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Still Deciding?</h2>
      <p className="text-gray-600 mb-8">Every Project Starts With A Chat. Send Us A Message.</p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button className="bg-[#087CA7] hover:bg-[#066a8f] text-white px-8 py-3 rounded-md font-semibold transition-colors w-full sm:w-auto">
          Contact Us
        </button>
        <button className="bg-[#FDB043] hover:bg-[#e59b32] text-gray-900 px-8 py-3 rounded-md font-semibold transition-colors w-full sm:w-auto">
          Book Consultation
        </button>
      </div>
    </div>
  </div>
);

// --- Main Component ---

export default function Plans() {
  return (
    <div className="font-sans min-h-screen bg-white">
      <PricingHeader />

      {/* Pricing Cards Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <PricingCard
          title="Basic"
          subtitle="Parents Who Want A Quick, Affordable Refresh."
          buttonText="Book This Plan"
          buttonColor="blue"
          isPremium={false}
          isPopular={false}
          features={[
            "Space Consultation (Online Or In-Person)",
            "Color + Decor Recommendation",
            "Lightweight Furniture Swap/Upgrade",
            "Wall Art & Organization Ideas",
            "Basic Styling Setup"
          ]}
        />
        <PricingCard
          title="Premium"
          subtitle="Hospitals, Daycare Centers, Or Large Educational Facilities."
          buttonText="Book This Plan"
          buttonColor="orange"
          isPremium={true}
          isPopular={true}
          features={[
            "Space Planning & Furniture Layout",
            "Color Palette + Theme Design",
            "3D Visualization Of Space, Wall Decors.",
            "Wall Design & Lighting Setup",
            "Final Room Styling And Delivery",
            "Everything In Basic Plan"
          ]}
        />
        <PricingCard
          title="Custom Quote"
          subtitle="Unique, Large-Scale, Or Partnership Projects."
          buttonText="Request A Custom Quote"
          buttonColor="blue"
          isPremium={false}
          isPopular={false}
          features={[
            "Free Discovery Call",
            "Custom Proposal & Timeline",
            "Custom Furniture Fabrication",
            "Define Your Scope, Goals, And Timelines.",
            "3D Visualization Of Space.",
            "Wall Decors."
          ]}
        />
      </div>

      <PlansOverview />
      <StillDeciding />
    
    </div>
  );
}
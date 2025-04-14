import VendorInterestForm from "@/components/vendor/vendor-interest-form";

export default function VendorPage() {
  return (
    <div className="py-8 px-6 md:px-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Become a Vendor</h1>
        <p className="text-xl text-gray-600">
          Register your interest to become a wedding service provider. We will
          notify you via email when the marketplace opens.
        </p>
      </div>
      <VendorInterestForm />
    </div>
  );
}

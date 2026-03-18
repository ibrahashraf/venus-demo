import Head from "next/head";

export default function DeleteData() {
    return (
      <>
      <Head>
         <title>Delete Data Policy | Venus Outlet</title>
        <meta
          name="description"
          content="Contact Venus Outlet for inquiries, complaints, or collaboration. Visit our branches in Mansoura and Alexandria."
        />
      </Head>
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Delete Data Policy</h1>
          <p className="mb-4">
            We respect your privacy and provide you with the option to delete your data at any time.
          </p>

          <h2 className="text-xl font-semibold mb-2">How is the deletion performed?</h2>
          <p className="mb-4">
            If you are registered using your account on Facebook or any other means:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>
              You can delete your account and data directly by clicking the user icon in the top right corner and then clicking on delete account. Then click on confirm delete account.
            </li>
            <li>
              Or you can contact us via email{" "}
              <a href="mailto:support@venusoutlet.net" className="text-blue-600">
                support@venusoutlet.net
              </a>{" "}
              to request account deletion.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">What will be deleted?</h2>
          <p className="mb-4">
            When deleting your account, all your data will be removed including:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Account information (name and email)</li>
            <li>Shipping addresses</li>
            <li>Order history</li>
            <li>Wishlist and shopping cart</li>
          </ul>

          <p className="mt-6">
            After deleting your account, your data cannot be recovered.
          </p>
        </div>
      </>
    );
  }
  
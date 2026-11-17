import Head from "next/head";

export default function DeleteData() {
    return (
      <>
      <Head>
         <title>سياسة حذف البيانات | Venus Outlet</title>
        <meta
          name="description"
          content="تواصل مع فينوس أوتلت للاستفسارات أو الشكاوى أو التعاون. قم بزيارة فروعنا في المنصورة والإسكندرية."
        />
      </Head>
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">سياسة حذف البيانات</h1>
          <p className="mb-4">
            نحن نحترم خصوصيتك ونوفر لك خيار حذف بياناتك في أي وقت.
          </p>

          <h2 className="text-xl font-semibold mb-2">كيف يتم الحذف؟</h2>
          <p className="mb-4">
            إذا كنت مسجلاً باستخدام حسابك على فيسبوك أو بأي وسيلة أخرى:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>
              يمكنك حذف حسابك وبياناتك مباشرة بالنقر على أيقونة المستخدم في الزاوية العلوية ثم اختيار حذف الحساب، وبعدها تأكيد الحذف.
            </li>
            <li>
              أو يمكنك التواصل معنا عبر البريد الإلكتروني{" "}
              <a href="mailto:support@venusoutlet.net" className="text-blue-600">
                support@venusoutlet.net
              </a>{" "}
              لطلب حذف الحساب.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">ما الذي سيتم حذفه؟</h2>
          <p className="mb-4">
            عند حذف حسابك، سيتم إزالة جميع بياناتك بما في ذلك:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>معلومات الحساب (الاسم والبريد الإلكتروني)</li>
            <li>عناوين الشحن</li>
            <li>سجل الطلبات</li>
            <li>المفضلة وسلة التسوق</li>
          </ul>

          <p className="mt-6">
            بعد حذف حسابك، لا يمكن استعادة بياناتك.
          </p>
        </div>
      </>
    );
  }

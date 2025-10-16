import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";

export default function DeleteData() {
    return (
      <>
      <Head>
         <title>سياسة حذف البيانات | Venus Outlet فينوس اوتليت</title>
        <meta
          name="description"
          content="تواصل مع Venus Outlet فينوس اوتليت للاستفسارات أو الشكاوى أو التعاون. زوروا فروعنا في المنصورة والإسكندرية."
        />
      </Head>
        <Header />
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">بيان حذف البيانات</h1>
          <p className="mb-4">
            نحن نحترم خصوصيتك ونوفر لك إمكانية حذف بياناتك في أي وقت.
          </p>

          <h2 className="text-xl font-semibold mb-2">كيف يتم الحذف؟</h2>
          <p className="mb-4">
            إذا كنت مسجلاً باستخدام حسابك على فيسبوك أو أي وسيلة أخرى:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>
              يمكنك حذف حسابك وبياناتك مباشرة من خلال الضغط على ايقونه المستخدم في اعلى اليمين ثم الضغط على حذف الحساب. ثم الضغط على تأكيد حذف الحساب.
            </li>
            <li>
              أو يمكنك مراسلتنا عبر البريد الإلكتروني{" "}
              <a href="mailto:support@venusoutlet.net" className="text-blue-600">
                support@venusoutlet.net
              </a>{" "}
              لطلب حذف الحساب.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">ما الذي سيتم حذفه؟</h2>
          <p className="mb-4">
            عند حذف الحساب، يتم إزالة جميع بياناتك بما في ذلك:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>معلومات الحساب (الاسم والبريد الإلكتروني)</li>
            <li>عناوين الشحن</li>
            <li>سجل الطلبات</li>
            <li>قائمة المفضلة وسلة التسوق</li>
          </ul>

          <p className="mt-6">
            بعد حذف الحساب، لا يمكن استعادة البيانات مرة أخرى.
          </p>
        </div>
        <Footer />
      </>
    );
  }
  
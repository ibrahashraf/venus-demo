
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import featuredImage from '../../public/assets/featured.png';
import featuredMobileImage from '../../public/assets/featuredmobile.png';
import Kids from '../../public/assets/kids.png';
import Women from '../../public/assets/women.png';

export default function Featured() {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-neutral-50 text-primary">

      {/* Main content */}
      <div className="relative overflow-hidden z-10 mx-auto flex  max-w-5xl items-center justify-end max-md:px-4 lg:pr-20 md:mt-10 max-md:pb-14">

        {/* Text */}
        <div className="relative z-10 w-[56%] max-w-[650px] text-right max-md:w-full max-md:self-start max-md:mt-4">

          <p className="relative mb-5 inline-block text-sm font-bold text-accent md:text-lg">
            هدومك من عندنا
            <span className="absolute -left-12 top-1/2 h-[2px] w-10 -translate-y-1/2 bg-accent" />
          </p>

          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            أحدث صيحات الأزياء
          </h1>

          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-accent md:text-5xl max-md:mb-4">
            عشانك وعشان ولادك
          </h2>

          <p className="md:mt-6 max-w-xl max-md:max-w-[190px] ml-auto text-sm leading-7 text-gray-600 md:text-lg">
            تسوقوا الآن من مجموعتنا الجديدة واستمتعوا بأفضل العروض
            على الملابس!
          </p>

          <div className="mt-4 mb:mt-6 flex max-md:flex-col-reverse items-end justify-end gap-3">

            <Link
              href="/Products"
              className="inline-flex items-center justify-center py-2 md:py-3 max-md:w-[130px]  max-md:text-sm font-bold md:px-9 gap-2 rounded-lg border border-primary  transition hover:bg-primary hover:text-white"
            >
              شوف الكولكشن
            </Link>
            <Link
              href="/Products"
              className="inline-flex items-center justify-center py-2 md:py-3 max-md:w-[130px] max-md:text-sm md:px-9 gap-2 rounded-lg bg-accent  font-bold text-white transition hover:opacity-90"
            >
              <ArrowBack /> تسوق الآن
            </Link>
          </div>
        </div>

        {/* Image overlapping the text area */}
        <div className="hidden md:flex  absolute  h-[110%] top-0 md:left-[-15%] z-20 w-[80%] items-end justify-center">
          <Image
            src={featuredImage}
            alt="تشكيلة فينوس للأم والأطفال"
            priority
            sizes="(min-width: 768px) 61vw, 95vw"
            className="h-full w-full object-contain "
          />
        </div>
        <div className="flex md:hidden  absolute z-20 items-end justify-center inset-y-auto top-[33%] left-[-10%] h-[80%] w-[75%]">
          <Image
            src={featuredMobileImage}
            alt="تشكيلة فينوس للأم والأطفال"
            priority
            sizes="(max-width: 768px) 95vw, 61vw"
            className="h-[92%] w-full object-contain object-bottom max-md:h-full"
          />
        </div>

      </div>
      <div className="flex max-md:flex-col-reverse container mx-auto md:px-40 md:py-10 justify-center items-center gap-1 max-md:mt-10">
          <Link
          className="w-full md:w-1/2 p-1 "
            href="/products">
            <Image
              src={Women}
              alt="تشكيلة فينوس للنساء"
              className="w-full object-contain"
            />
          </Link>
          <Link
          className="w-full md:w-1/2 p-1"
            href="/products">
            <Image
              src={Kids}
              alt="تشكيلة فينوس للأطفال"
            className="w-full object-contain"
          />
          </Link>
      </div>
    </section>
  );
}

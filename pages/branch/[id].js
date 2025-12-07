import CarouselModal from '@/components/modals/CarouselModal';
import Image from 'next/image';
import { useState } from 'react'
import Error from '../_error';
import Head from 'next/head';
import axiosClient from '@/lib/axiosClient';

export default function BranchPage({ branch, error, statusCode }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    if (error) {
        return <Error statusCode={statusCode || 500} />
    }
    return (
        <>
        <Head>
            <title>{branch.name} | Venus Outlet فينوس اوتليت</title>
            <meta
                name="description"
                content={`Venus Outlet فينوس اوتليت | ${branch.name} المنتجات المتاحه في فرع `}
            />
            <meta property="og:title" content={` Venus Outlet  فينوس اوتليت | ${branch.name}`   } />
            <meta
                property="og:description"
                content=" Venus Outlet فينوس اوتليت تقدم تشكيلات من ملابس النساء والأطفال بعروض رائعة في فروع المنصورة والإسكندرية."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://venusoutlet.net/branch/${branch._id}`}/>
            <meta property="og:image" content="https://venusoutlet.net/og-image.jpg" />
            <meta property="og:locale" content="ar_AR" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
            <div className='flex flex-col items-center justify-center text-center gap-2 py-20 px-5'>
                <h2 className='text-3xl font-bold mb-4 leading-relaxed'>متوفر الآن في فرع <span className='text-accent'>{branch.name}</span></h2>
                <p>{branch.address}</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
                    {branch.images.map((image, index) => (
                        <div key={index} className='w-[300px] h-[400px] overflow-hidden cursor-pointer' onClick={() => {setIsModalOpen(true); setSelectedIndex(index)}}>
                            <Image
                                src={image}
                                alt={`Image ${index}`}
                                width={300}
                                height={400}
                            />
                        </div>
                    ))}
                </div>
            </div>
            { isModalOpen && (
                <CarouselModal images={branch.images} alt={''} initialIndex={selectedIndex} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    );
}

export async function getServerSideProps(context) {
    try {
        const { id } = context.query;
      
        const { data } = await axiosClient.get(`${process.env.WEBSITE_URL}/api/branches/?id=${id}`);
        return {
          props: {
            branch: data || null,
            error: null,
            statusCode: null,
          },
        };
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        return {
            props: {
                branch: null,
                error: "حدث خطأ ما",
                statusCode: 500,
            },
        };
    }
}

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axiosClient from "@/lib/axiosClient";

export default function BranchesSection() {
    const [branches, setBranches] = useState([]);
    const router = useRouter();
    useEffect(() => {
        axiosClient.get('/api/branches').then(res => {
            setBranches(res.data);
        }).catch(err => console.log(err));
    }, []);
    return (
        <div className="relative h-[calc(100vh-73px)] md:h-[calc(100vh-80px)]  flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-6 sm:gap-8 px-4 sm:px-8 md:px-16">
                {branches.map((branch) => (
                    <div
                        key={branch._id}
                        onClick={() => router.push(`/branch/${branch._id}`)}
                        className="z-10 flex flex-col gap-6 items-center justify-center w-full h-[250px] sm:h-[320px] md:h-[400px] rounded-sm overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition duration-300 ease-in-out p-8
                        border border-accent bg-neutral-50/60 hover:bg-neutral-50"
                    >
                        <div className="text-center text-2xl leading-normal"> المتوفر الآن في فرع <span className="font-bold">{branch.name} <ArrowBackIcon sx={{ fontSize: 30 }} /></span></div>
                        <div className="text-xl text-center">{branch.address}</div>
                    </div>
                ))}
            </div>


            <div className="absolute w-full h-full overflow-hidden">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 1440 560"
                    preserveAspectRatio="none"
                    className=" absolute top-0 left-0 w-full h-full hidden md:block"
                >
                <g mask="url(#SvgjsMask1000)" fill="none">
                    <rect x="0" y="0" className="fill-neutral-200 w-full h-full"></rect>
                    <path
                        d="M0,352.436C71.494,372.722,161.437,387.429,218.035,339.268C275.617,290.27,242.101,193.546,269.526,123.088C294.632,58.589,365.958,15.72,370.846,-53.32C376.053,-126.867,343.527,-200.129,296.426,-256.854C248.814,-314.194,182.645,-362.32,108.446,-369.334C37.681,-376.024,-24.174,-328.019,-86.035,-293.01C-135.597,-264.961,-174.61,-226.448,-214.991,-186.291C-258.818,-142.707,-310.621,-105.591,-332.595,-47.82C-357.54,17.763,-383.918,98.985,-345.938,157.985C-307.327,217.965,-212.964,199.666,-150.781,234.619C-94.03,266.519,-62.63,334.665,0,352.436"
                        className="fill-secondary"
                    />
                    <path
                        d="M1440 1048.059C1530.063 1047.584 1601.193 977.025 1673.48 923.302 1741.225 872.9549999999999 1815.035 823.976 1846.759 745.76 1877.95 668.858 1868.246 581.346 1844.416 501.854 1822.6970000000001 429.405 1766.382 377.217 1718.681 318.522 1669.266 257.718 1632.587 180.93200000000002 1559.878 151.73399999999998 1484.852 121.606 1401.592 143.25900000000001 1322.365 159.373 1236.576 176.822 1147.281 191.675 1081.196 249.09500000000003 1010.2370000000001 310.75 935.54 394.937 943.45 488.60699999999997 951.469 583.568 1070.879 624.446 1119.797 706.232 1160.92 774.985 1150.163 867.3050000000001 1204.932 925.773 1266.563 991.566 1349.851 1048.534 1440 1048.059"
                        className="fill-secondary"
                    />
                </g>
                </svg>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    version="1.1" 
                    xmlnsXlink="http://www.w3.org/1999/xlink" 
                    preserveAspectRatio="none" 
                    viewBox="0 0 400 560"
                    className="absolute top-0 left-0 w-full h-full block md:hidden"  
                >
                <g mask="url(&quot;#SvgjsMask1006&quot;)" fill="none">
                    <rect x="0" y="0" className="fill-neutral-200 w-full h-full" />
                    <path 
                        d="M0,229.738C47.996,234.788,98.936,242.917,141.532,220.229C185.317,196.908,221.362,154.456,232.22,106.051C242.562,59.946,205.51,18.164,197.294,-28.367C189.448,-72.806,210.953,-123.416,185.165,-160.447C159.046,-197.954,109.923,-215.467,64.374,-219.237C22.461,-222.706,-11.338,-186.6,-52.897,-180.15C-103.976,-172.223,-163.736,-208.854,-204.803,-177.463C-244.684,-146.979,-244.541,-85.092,-242.891,-34.922C-241.404,10.296,-217.047,49.46,-196.02,89.519C-176.135,127.402,-158.401,167.438,-123.603,192.33C-87.868,217.892,-43.695,225.14,0,229.738" 
                        className="fill-secondary" 
                    />
                    <path 
                        d="M400 764.452C439.382 769.63 477.175 752.81 513.307 736.309 554.489 717.502 603.3969999999999 702.6179999999999 623.845 662.226 644.396 621.628 631.073 572.31 618.4590000000001 528.59 607.047 489.03700000000003 582.689 456.16700000000003 555.479 425.276 528.468 394.61 501.483 359.047 461.53499999999997 350.432 422.246 341.959 384.147 364.41999999999996 347.256 380.371 314.38599999999997 394.584 285.371 413.56399999999996 259.14099999999996 437.945 230.113 464.926 192.139 490.078 186.956 529.369 181.777 568.629 211.3 603.136 232.978 636.276 251.933 665.254 276.879 687.754 304.349 708.835 334.21299999999997 731.7529999999999 362.677 759.545 400 764.452" 
                        className="fill-secondary" 
                    />
                </g>
                </svg>
            </div>
            <div className="bg-accent w-24 sm:w-32 md:w-40 absolute top-0 right-[7%] sm:right-[20%] h-full " />
        </div>
    );
}

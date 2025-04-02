import { CiEdit } from "react-icons/ci";

export function Footer() {
  return (
    <div>
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} <br /> All right reserved by
            👉耀乘科技工作室
          </p>

          <div className="flex flex-row items-center gap-4">
            <CiEdit className="size-5 text-yellow-300" />
            <div>Create by Tony Wu 👈</div>
          </div>
        </aside>
      </footer>
    </div>
  );
}

export default Footer;

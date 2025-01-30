import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { vars } from "hardhat/config";

const initialAdmin = vars.get("INITIAL_ADMIN_ADDRESS");
const NatureTokenModule = buildModule("NatureTokenModule", m => {
  const contract = m.contract("NatureToken", [initialAdmin]);

  return { contract };
});

export default NatureTokenModule;

import { UniverseLogError } from "./error/UniverseLogError";

const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
const isNode = new Function("try {return this===global;}catch(e){return false;}");

const getWindow = new Function("try {return this;}catch(e){return undefined}");
function getBrowserEnv(name: string): string | undefined {
    const probablyWindow = getWindow();
    if (!probablyWindow) {
        throw new UniverseLogError("PortableEnv: environment is browser, but could not get window object");
    }
    return probablyWindow[name];
}

function getNodeEnv(name: string): string | undefined {
    if (!process) {
        throw new UniverseLogError("PortableEnv: environment is node, but process object does not exist");
    }
    if (!process.env) {
        throw new UniverseLogError("PortableEnv: environment is node, but process.env object does not exist");
    }
    return process.env[name];
}

export function PortableEnv(name: string): string | undefined {
    if (isBrowser()) {
        return getBrowserEnv(name);
    } else if (isNode()) {
        return getNodeEnv(name);
    } else {
        throw new UniverseLogError("PortableEnv: unknown environment (not browser, not node)");
    }
}

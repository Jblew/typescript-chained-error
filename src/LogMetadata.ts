export interface LogMetadata {
    name?: string;
    project?: string;
    environment?: string;
    service?: string;
    module?: string;
    [x: string]: any;
}

export namespace LogMetadata {
    export const EMPTY_METADATA: LogMetadata = {
        service: "universe-log-no-metadata",
    };

    export function getBestIdentifier(metadata: LogMetadata): string {
        return (
            metadata.name ||
            (metadata.project && metadata.service ? `${metadata.project}.${metadata.service}` : undefined) ||
            metadata.project ||
            metadata.service ||
            "universe-log-no-metadata"
        );
    }
}

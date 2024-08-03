export function formatDate(range) {
    if (range) {
        switch (range) {
            case '1D':
                return 'h:mm A';
            case '7D':
                return 'D';
            case '1M':
                return 'D/M h:mm';
            case '1Y':
                return 'D/M/Y';
            case "ALL":
                return 'D/M/Y h:mm'
            default:
                return 'Invalid range';
        }
    } else {
        return 'D/M h:mm';
    }
}


export function calculateMinTickGap(range) {
    switch (range) {
        case '1D':
            return 60;
        case '7D':
            return 220;
        case '1M':
            return 240;
        case '1Y':
            return 200;
        case "ALL":
            return 100
        default:
            return 30; // Default value if range is not specified
    }
}

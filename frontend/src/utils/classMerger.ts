export default function cm(...classes: any[]) {
    return classes.filter(v => v).join(" ");
} 
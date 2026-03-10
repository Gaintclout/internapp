"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const axios_1 = require("axios");
const TOKEN_KEY = "internapp_token";
const BASE_URL = "http://127.0.0.1:8000";
axios_1.default.defaults.baseURL = BASE_URL;
/* ===============================
   JWT CHECK
================================ */
function isExpired(token) {
    try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
        return Date.now() > payload.exp * 1000;
    }
    catch {
        return true;
    }
}
/* ===============================
   CODE NORMALIZER
================================ */
function normalize(code) {
    return code.replace(/\s+/g, " ").trim();
}
/* ===============================
   ACTIVATE EXTENSION
================================ */
function activate(context) {
    console.log("InternApp extension activated");
    /* ===============================
       LOGIN CALLBACK
    ================================ */
    vscode.window.registerUriHandler({
        async handleUri(uri) {
            try {
                const authCode = new URLSearchParams(uri.query).get("auth_code");
                if (!authCode)
                    return;
                const res = await axios_1.default.get(`/vscode/authorize?auth_code=${authCode}`);
                await context.globalState.update(TOKEN_KEY, res.data.access_token);
                vscode.window.showInformationMessage("InternApp connected ✔");
            }
            catch (err) {
                vscode.window.showErrorMessage("Authorization failed");
                console.error(err);
            }
        }
    });
    /* ===============================
       OPEN TASK WORKSPACE
    ================================ */
    context.subscriptions.push(vscode.commands.registerCommand("internapp.runCode", async () => {
        try {
            const token = context.globalState.get(TOKEN_KEY);
            if (!token || isExpired(token)) {
                vscode.window.showErrorMessage("Session expired. Please login again.");
                return;
            }
            const ctx = await axios_1.default.get("/vscode/context", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { student_id, project_task_id, task_seq } = ctx.data;
            const taskSeq = Number(task_seq);
            if (!student_id || !project_task_id || !taskSeq) {
                vscode.window.showErrorMessage("Task context missing");
                return;
            }
            const BASE = "C:/Users/DELL/InternAppWorkspaces";
            const taskPath = `${BASE}/${student_id}/${project_task_id}/task-${taskSeq}`;
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(taskPath));
            let entryFile;
            if (taskSeq === 1) {
                entryFile = `${taskPath}/App.jsx`;
                try {
                    await vscode.workspace.fs.stat(vscode.Uri.file(entryFile));
                }
                catch {
                    await vscode.workspace.fs.writeFile(vscode.Uri.file(entryFile), Buffer.from(`export default function App() {
  return <div>Task 1</div>;
}`));
                }
            }
            else {
                entryFile = `${taskPath}/main.py`;
                try {
                    await vscode.workspace.fs.stat(vscode.Uri.file(entryFile));
                }
                catch {
                    await vscode.workspace.fs.writeFile(vscode.Uri.file(entryFile), Buffer.from("# Write your solution\n"));
                }
            }
            await vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(taskPath), false);
            vscode.window.showInformationMessage(`Workspace ready for Task ${taskSeq}`);
        }
        catch (err) {
            vscode.window.showErrorMessage("Failed to load task workspace");
            console.error(err);
        }
    }));
    /* ===============================
       SUBMIT TASK
    ================================ */
    context.subscriptions.push(vscode.commands.registerCommand("internapp.submitCode", async () => {
        try {
            const token = context.globalState.get(TOKEN_KEY);
            if (!token || isExpired(token)) {
                vscode.window.showErrorMessage("Session expired");
                return;
            }
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("Open a file first");
                return;
            }
            const sourceCode = normalize(editor.document.getText());
            if (sourceCode.length < 5) {
                vscode.window.showErrorMessage("File empty");
                return;
            }
            const ctx = await axios_1.default.get("/vscode/context", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { project_task_id } = ctx.data;
            if (!project_task_id) {
                vscode.window.showErrorMessage("Task ID missing");
                return;
            }
            const res = await axios_1.default.post("/vscode/submit", {
                task_id: project_task_id,
                source_code: sourceCode,
                framework: true
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            vscode.window.showInformationMessage("✅ Task submitted successfully");
            console.log(res.data);
        }
        catch (err) {
            console.error(err);
            const msg = err?.response?.data?.detail ||
                err?.message ||
                "Submission failed";
            vscode.window.showErrorMessage(msg);
        }
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map
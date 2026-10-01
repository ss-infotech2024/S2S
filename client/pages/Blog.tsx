import usePageMeta from "@/hooks/use-page-meta";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useSpring,
} from "framer-motion";
import Layout from "@/components/site/Layout";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BookOpenIcon,
  BookmarkIcon,
  ShareIcon,
  XMarkIcon,
  CheckIcon,
  SparklesIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";

/* -------------------------------------------------------------------------- */
/*  Embedded fallback covers (used if a remote photo cannot load)             */
/* -------------------------------------------------------------------------- */

const covers = {
  "interview-prep": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20800%20500%22%20preserveAspectRatio=%22xMidYMid%20slice%22%3E%20%3Cdefs%3E%20%3ClinearGradient%20id=%22bg1%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%230a1a3f%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23050d24%22/%3E%3C/linearGradient%3E%20%3CradialGradient%20id=%22g11%22%20cx=%22.2%22%20cy=%22.15%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%233b82f6%22%20stop-opacity=%22.55%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%233b82f6%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3CradialGradient%20id=%22g21%22%20cx=%22.9%22%20cy=%22.95%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%238b5cf6%22%20stop-opacity=%22.5%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%238b5cf6%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3ClinearGradient%20id=%22ac1%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%233b82f6%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%238b5cf6%22/%3E%3C/linearGradient%3E%20%3Cpattern%20id=%22gr1%22%20width=%2240%22%20height=%2240%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M40%200H0V40%22%20fill=%22none%22%20stroke=%22%23fff%22%20stroke-opacity=%22.05%22/%3E%3C/pattern%3E%20%3C/defs%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23bg1)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23gr1)%22/%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g11)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g21)%22/%3E%20%3Cg%3E%3Crect%20x=%22110%22%20y=%2290%22%20width=%22360%22%20height=%22300%22%20rx=%2216%22%20fill=%22%230b1633%22%20stroke=%22%23fff%22%20stroke-opacity=%22.14%22/%3E%20%3Crect%20x=%22110%22%20y=%2290%22%20width=%22360%22%20height=%2238%22%20rx=%2216%22%20fill=%22%23fff%22%20fill-opacity=%22.05%22/%3E%20%3Ccircle%20cx=%22132%22%20cy=%22109%22%20r=%225%22%20fill=%22%23ff5f57%22/%3E%3Ccircle%20cx=%22150%22%20cy=%22109%22%20r=%225%22%20fill=%22%23febc2e%22/%3E%3Ccircle%20cx=%22168%22%20cy=%22109%22%20r=%225%22%20fill=%22%2328c840%22/%3E%3C/g%3E%3Crect%20x=%22140%22%20y=%22150%22%20width=%22120%22%20height=%2210%22%20rx=%225%22%20fill=%22%2360a5fa%22%20fill-opacity=%220.9%22/%3E%3Crect%20x=%22270%22%20y=%22150%22%20width=%2290%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.35%22/%3E%3Crect%20x=%22160%22%20y=%22180%22%20width=%22170%22%20height=%2210%22%20rx=%225%22%20fill=%22%23a78bfa%22%20fill-opacity=%220.8%22/%3E%3Crect%20x=%22140%22%20y=%22210%22%20width=%2260%22%20height=%2210%22%20rx=%225%22%20fill=%22%2334d399%22%20fill-opacity=%220.8%22/%3E%3Crect%20x=%22210%22%20y=%22210%22%20width=%22130%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.3%22/%3E%3Crect%20x=%22160%22%20y=%22240%22%20width=%22100%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.3%22/%3E%3Crect%20x=%22270%22%20y=%22240%22%20width=%22120%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fbbf24%22%20fill-opacity=%220.8%22/%3E%3Crect%20x=%22140%22%20y=%22270%22%20width=%22150%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.25%22/%3E%3Crect%20x=%22160%22%20y=%22300%22%20width=%22190%22%20height=%2210%22%20rx=%225%22%20fill=%22%2360a5fa%22%20fill-opacity=%220.7%22/%3E%3Crect%20x=%22140%22%20y=%22330%22%20width=%2280%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.25%22/%3E%3Cg%20stroke=%22url(%23ac1)%22%20stroke-width=%223%22%20fill=%22none%22%20stroke-linecap=%22round%22%3E%3Cpath%20d=%22M600%20150%20L540%20230%22/%3E%3Cpath%20d=%22M600%20150%20L660%20230%22/%3E%3Cpath%20d=%22M540%20230%20L505%20310%22/%3E%3Cpath%20d=%22M540%20230%20L575%20310%22/%3E%3Cpath%20d=%22M660%20230%20L695%20310%22/%3E%3C/g%3E%20%3Cg%20fill=%22%230b1633%22%20stroke=%22url(%23ac1)%22%20stroke-width=%223%22%3E%3Ccircle%20cx=%22600%22%20cy=%22150%22%20r=%2226%22/%3E%3Ccircle%20cx=%22540%22%20cy=%22230%22%20r=%2222%22/%3E%3Ccircle%20cx=%22660%22%20cy=%22230%22%20r=%2222%22/%3E%3Ccircle%20cx=%22505%22%20cy=%22310%22%20r=%2218%22/%3E%3Ccircle%20cx=%22575%22%20cy=%22310%22%20r=%2218%22/%3E%3Ccircle%20cx=%22695%22%20cy=%22310%22%20r=%2218%22/%3E%3C/g%3E%20%3Cg%20fill=%22%23fff%22%20font-family=%22Inter,Arial%22%20font-weight=%22700%22%20font-size=%2218%22%20text-anchor=%22middle%22%3E%3Ctext%20x=%22600%22%20y=%22157%22%3E8%3C/text%3E%3Ctext%20x=%22540%22%20y=%22237%22%20font-size=%2216%22%3E3%3C/text%3E%3Ctext%20x=%22660%22%20y=%22237%22%20font-size=%2216%22%3E10%3C/text%3E%3C/g%3E%20%3Cg%20transform=%22translate(560%20400)%22%3E%3Crect%20width=%22150%22%20height=%2244%22%20rx=%2222%22%20fill=%22url(%23ac1)%22/%3E%3Ctext%20x=%2275%22%20y=%2228%22%20fill=%22%23fff%22%20font-family=%22Inter,Arial%22%20font-weight=%22700%22%20font-size=%2216%22%20text-anchor=%22middle%22%3EO(log%20n)%3C/text%3E%3C/g%3E%20%3C/svg%3E",
  "frontend-tools": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20800%20500%22%20preserveAspectRatio=%22xMidYMid%20slice%22%3E%20%3Cdefs%3E%20%3ClinearGradient%20id=%22bg2%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%230a1a3f%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23050d24%22/%3E%3C/linearGradient%3E%20%3CradialGradient%20id=%22g12%22%20cx=%22.2%22%20cy=%22.15%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%2306b6d4%22%20stop-opacity=%22.55%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%2306b6d4%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3CradialGradient%20id=%22g22%22%20cx=%22.9%22%20cy=%22.95%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%236366f1%22%20stop-opacity=%22.5%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%236366f1%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3ClinearGradient%20id=%22ac2%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%2306b6d4%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%236366f1%22/%3E%3C/linearGradient%3E%20%3Cpattern%20id=%22gr2%22%20width=%2240%22%20height=%2240%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M40%200H0V40%22%20fill=%22none%22%20stroke=%22%23fff%22%20stroke-opacity=%22.05%22/%3E%3C/pattern%3E%20%3C/defs%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23bg2)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23gr2)%22/%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g12)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g22)%22/%3E%20%3Cg%3E%3Crect%20x=%22120%22%20y=%2280%22%20width=%22560%22%20height=%22340%22%20rx=%2216%22%20fill=%22%230b1633%22%20stroke=%22%23fff%22%20stroke-opacity=%22.14%22/%3E%20%3Crect%20x=%22120%22%20y=%2280%22%20width=%22560%22%20height=%2238%22%20rx=%2216%22%20fill=%22%23fff%22%20fill-opacity=%22.05%22/%3E%20%3Ccircle%20cx=%22142%22%20cy=%2299%22%20r=%225%22%20fill=%22%23ff5f57%22/%3E%3Ccircle%20cx=%22160%22%20cy=%2299%22%20r=%225%22%20fill=%22%23febc2e%22/%3E%3Ccircle%20cx=%22178%22%20cy=%2299%22%20r=%225%22%20fill=%22%2328c840%22/%3E%3C/g%3E%3Crect%20x=%22150%22%20y=%22140%22%20width=%22500%22%20height=%2234%22%20rx=%2210%22%20fill=%22%23fff%22%20fill-opacity=%22.07%22/%3E%3Crect%20x=%22170%22%20y=%22153%22%20width=%22140%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.4%22/%3E%3Crect%20x=%22150%22%20y=%22190%22%20width=%22150%22%20height=%22180%22%20rx=%2214%22%20fill=%22url(%23ac2)%22%20fill-opacity=%22.9%22/%3E%3Crect%20x=%22316%22%20y=%22190%22%20width=%22150%22%20height=%2285%22%20rx=%2214%22%20fill=%22%23fff%22%20fill-opacity=%22.08%22%20stroke=%22%23fff%22%20stroke-opacity=%22.15%22/%3E%3Crect%20x=%22482%22%20y=%22190%22%20width=%22168%22%20height=%2285%22%20rx=%2214%22%20fill=%22%23fff%22%20fill-opacity=%22.08%22%20stroke=%22%23fff%22%20stroke-opacity=%22.15%22/%3E%3Crect%20x=%22316%22%20y=%22288%22%20width=%22334%22%20height=%2282%22%20rx=%2214%22%20fill=%22%23fff%22%20fill-opacity=%22.06%22%20stroke=%22%23fff%22%20stroke-opacity=%22.15%22/%3E%3Crect%20x=%22334%22%20y=%22210%22%20width=%2280%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.5%22/%3E%3Crect%20x=%22334%22%20y=%22236%22%20width=%22100%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.25%22/%3E%3Crect%20x=%22500%22%20y=%22210%22%20width=%2290%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.5%22/%3E%3Crect%20x=%22500%22%20y=%22236%22%20width=%22120%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.25%22/%3E%3Crect%20x=%22334%22%20y=%22310%22%20width=%22140%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.45%22/%3E%3Crect%20x=%22334%22%20y=%22336%22%20width=%22220%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.22%22/%3E%3Crect%20x=%22170%22%20y=%22330%22%20width=%22110%22%20height=%2226%22%20rx=%2213%22%20fill=%22%23fff%22/%3E%3Cg%20fill=%22none%22%20stroke=%22%2322d3ee%22%20stroke-width=%223.5%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20transform=%22translate(650%2060)%22%3E%3Cellipse%20rx=%2252%22%20ry=%2220%22%20fill=%22none%22/%3E%3Cellipse%20rx=%2252%22%20ry=%2220%22%20transform=%22rotate(60)%22/%3E%3Cellipse%20rx=%2252%22%20ry=%2220%22%20transform=%22rotate(120)%22/%3E%3Ccircle%20r=%226%22%20fill=%22%2322d3ee%22/%3E%3C/g%3E%3Ctext%20x=%22105%22%20y=%22470%22%20fill=%22%23fff%22%20fill-opacity=%22.5%22%20font-family=%22Inter,Arial%22%20font-size=%2220%22%20font-weight=%22700%22%3E%26lt;/%26gt;%3C/text%3E%20%3C/svg%3E",
  "ai-education": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20800%20500%22%20preserveAspectRatio=%22xMidYMid%20slice%22%3E%20%3Cdefs%3E%20%3ClinearGradient%20id=%22bg3%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%230a1a3f%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23050d24%22/%3E%3C/linearGradient%3E%20%3CradialGradient%20id=%22g13%22%20cx=%22.2%22%20cy=%22.15%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%238b5cf6%22%20stop-opacity=%22.55%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%238b5cf6%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3CradialGradient%20id=%22g23%22%20cx=%22.9%22%20cy=%22.95%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%23ec4899%22%20stop-opacity=%22.5%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23ec4899%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3ClinearGradient%20id=%22ac3%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%238b5cf6%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23ec4899%22/%3E%3C/linearGradient%3E%20%3Cpattern%20id=%22gr3%22%20width=%2240%22%20height=%2240%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M40%200H0V40%22%20fill=%22none%22%20stroke=%22%23fff%22%20stroke-opacity=%22.05%22/%3E%3C/pattern%3E%20%3C/defs%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23bg3)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23gr3)%22/%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g13)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g23)%22/%3E%20%3Cg%20stroke=%22%23fff%22%20stroke-opacity=%22.18%22%20stroke-width=%221.5%22%3E%3Cline%20x1=%22150%22%20y1=%22150%22%20x2=%22300%22%20y2=%22110%22/%3E%3Cline%20x1=%22150%22%20y1=%22150%22%20x2=%22300%22%20y2=%22210%22/%3E%3Cline%20x1=%22150%22%20y1=%22150%22%20x2=%22300%22%20y2=%22310%22/%3E%3Cline%20x1=%22150%22%20y1=%22150%22%20x2=%22300%22%20y2=%22400%22/%3E%3Cline%20x1=%22150%22%20y1=%22250%22%20x2=%22300%22%20y2=%22110%22/%3E%3Cline%20x1=%22150%22%20y1=%22250%22%20x2=%22300%22%20y2=%22210%22/%3E%3Cline%20x1=%22150%22%20y1=%22250%22%20x2=%22300%22%20y2=%22310%22/%3E%3Cline%20x1=%22150%22%20y1=%22250%22%20x2=%22300%22%20y2=%22400%22/%3E%3Cline%20x1=%22150%22%20y1=%22350%22%20x2=%22300%22%20y2=%22110%22/%3E%3Cline%20x1=%22150%22%20y1=%22350%22%20x2=%22300%22%20y2=%22210%22/%3E%3Cline%20x1=%22150%22%20y1=%22350%22%20x2=%22300%22%20y2=%22310%22/%3E%3Cline%20x1=%22150%22%20y1=%22350%22%20x2=%22300%22%20y2=%22400%22/%3E%3Cline%20x1=%22300%22%20y1=%22110%22%20x2=%22450%22%20y2=%22150%22/%3E%3Cline%20x1=%22300%22%20y1=%22110%22%20x2=%22450%22%20y2=%22250%22/%3E%3Cline%20x1=%22300%22%20y1=%22110%22%20x2=%22450%22%20y2=%22350%22/%3E%3Cline%20x1=%22300%22%20y1=%22210%22%20x2=%22450%22%20y2=%22150%22/%3E%3Cline%20x1=%22300%22%20y1=%22210%22%20x2=%22450%22%20y2=%22250%22/%3E%3Cline%20x1=%22300%22%20y1=%22210%22%20x2=%22450%22%20y2=%22350%22/%3E%3Cline%20x1=%22300%22%20y1=%22310%22%20x2=%22450%22%20y2=%22150%22/%3E%3Cline%20x1=%22300%22%20y1=%22310%22%20x2=%22450%22%20y2=%22250%22/%3E%3Cline%20x1=%22300%22%20y1=%22310%22%20x2=%22450%22%20y2=%22350%22/%3E%3Cline%20x1=%22300%22%20y1=%22400%22%20x2=%22450%22%20y2=%22150%22/%3E%3Cline%20x1=%22300%22%20y1=%22400%22%20x2=%22450%22%20y2=%22250%22/%3E%3Cline%20x1=%22300%22%20y1=%22400%22%20x2=%22450%22%20y2=%22350%22/%3E%3Cline%20x1=%22450%22%20y1=%22150%22%20x2=%22590%22%20y2=%22250%22/%3E%3Cline%20x1=%22450%22%20y1=%22250%22%20x2=%22590%22%20y2=%22250%22/%3E%3Cline%20x1=%22450%22%20y1=%22350%22%20x2=%22590%22%20y2=%22250%22/%3E%3C/g%3E%3Ccircle%20cx=%22150%22%20cy=%22150%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%2360a5fa%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22150%22%20cy=%22150%22%20r=%227%22%20fill=%22%2360a5fa%22/%3E%3Ccircle%20cx=%22150%22%20cy=%22250%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%2360a5fa%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22150%22%20cy=%22250%22%20r=%227%22%20fill=%22%2360a5fa%22/%3E%3Ccircle%20cx=%22150%22%20cy=%22350%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%2360a5fa%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22150%22%20cy=%22350%22%20r=%227%22%20fill=%22%2360a5fa%22/%3E%3Ccircle%20cx=%22300%22%20cy=%22110%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%23a78bfa%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22300%22%20cy=%22110%22%20r=%227%22%20fill=%22%23a78bfa%22/%3E%3Ccircle%20cx=%22300%22%20cy=%22210%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%23a78bfa%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22300%22%20cy=%22210%22%20r=%227%22%20fill=%22%23a78bfa%22/%3E%3Ccircle%20cx=%22300%22%20cy=%22310%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%23a78bfa%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22300%22%20cy=%22310%22%20r=%227%22%20fill=%22%23a78bfa%22/%3E%3Ccircle%20cx=%22300%22%20cy=%22400%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%23a78bfa%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22300%22%20cy=%22400%22%20r=%227%22%20fill=%22%23a78bfa%22/%3E%3Ccircle%20cx=%22450%22%20cy=%22150%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%2322d3ee%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22450%22%20cy=%22150%22%20r=%227%22%20fill=%22%2322d3ee%22/%3E%3Ccircle%20cx=%22450%22%20cy=%22250%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%2322d3ee%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22450%22%20cy=%22250%22%20r=%227%22%20fill=%22%2322d3ee%22/%3E%3Ccircle%20cx=%22450%22%20cy=%22350%22%20r=%2218%22%20fill=%22%230b1633%22%20stroke=%22%2322d3ee%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22450%22%20cy=%22350%22%20r=%227%22%20fill=%22%2322d3ee%22/%3E%3Ccircle%20cx=%22590%22%20cy=%22250%22%20r=%2230%22%20fill=%22%230b1633%22%20stroke=%22%23f472b6%22%20stroke-width=%223%22/%3E%3Ccircle%20cx=%22590%22%20cy=%22250%22%20r=%2212%22%20fill=%22%23f472b6%22/%3E%3Cg%20transform=%22translate(655%20120)%22%3E%3Cpath%20d=%22M0%2040%20L70%208%20L140%2040%20L70%2072%20Z%22%20fill=%22url(%23ac3)%22/%3E%3Cpath%20d=%22M28%2056%20V92%20Q70%20118%20112%2092%20V56%20L70%2076%20Z%22%20fill=%22%23fff%22%20fill-opacity=%22.85%22/%3E%3Cpath%20d=%22M135%2044%20V100%22%20stroke=%22%23fbbf24%22%20stroke-width=%224%22%20stroke-linecap=%22round%22/%3E%3Ccircle%20cx=%22135%22%20cy=%22106%22%20r=%227%22%20fill=%22%23fbbf24%22/%3E%3C/g%3E%20%3C/svg%3E",
  "python-ds": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20800%20500%22%20preserveAspectRatio=%22xMidYMid%20slice%22%3E%20%3Cdefs%3E%20%3ClinearGradient%20id=%22bg4%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%230a1a3f%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23050d24%22/%3E%3C/linearGradient%3E%20%3CradialGradient%20id=%22g14%22%20cx=%22.2%22%20cy=%22.15%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%2322c55e%22%20stop-opacity=%22.55%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%2322c55e%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3CradialGradient%20id=%22g24%22%20cx=%22.9%22%20cy=%22.95%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%233b82f6%22%20stop-opacity=%22.5%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%233b82f6%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3ClinearGradient%20id=%22ac4%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%2322c55e%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%233b82f6%22/%3E%3C/linearGradient%3E%20%3Cpattern%20id=%22gr4%22%20width=%2240%22%20height=%2240%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M40%200H0V40%22%20fill=%22none%22%20stroke=%22%23fff%22%20stroke-opacity=%22.05%22/%3E%3C/pattern%3E%20%3C/defs%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23bg4)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23gr4)%22/%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g14)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g24)%22/%3E%20%3Cg%3E%3Crect%20x=%2290%22%20y=%2290%22%20width=%22330%22%20height=%22250%22%20rx=%2216%22%20fill=%22%230b1633%22%20stroke=%22%23fff%22%20stroke-opacity=%22.14%22/%3E%20%3Crect%20x=%2290%22%20y=%2290%22%20width=%22330%22%20height=%2238%22%20rx=%2216%22%20fill=%22%23fff%22%20fill-opacity=%22.05%22/%3E%20%3Ccircle%20cx=%22112%22%20cy=%22109%22%20r=%225%22%20fill=%22%23ff5f57%22/%3E%3Ccircle%20cx=%22130%22%20cy=%22109%22%20r=%225%22%20fill=%22%23febc2e%22/%3E%3Ccircle%20cx=%22148%22%20cy=%22109%22%20r=%225%22%20fill=%22%2328c840%22/%3E%3C/g%3E%3Crect%20x=%22120%22%20y=%22150%22%20width=%2260%22%20height=%2210%22%20rx=%225%22%20fill=%22%23f472b6%22%20fill-opacity=%220.9%22/%3E%3Crect%20x=%22190%22%20y=%22150%22%20width=%22100%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.3%22/%3E%3Crect%20x=%22120%22%20y=%22180%22%20width=%2290%22%20height=%2210%22%20rx=%225%22%20fill=%22%2360a5fa%22%20fill-opacity=%220.9%22/%3E%3Crect%20x=%22220%22%20y=%22180%22%20width=%22130%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.3%22/%3E%3Crect%20x=%22140%22%20y=%22210%22%20width=%22170%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.25%22/%3E%3Crect%20x=%22120%22%20y=%22240%22%20width=%22110%22%20height=%2210%22%20rx=%225%22%20fill=%22%2334d399%22%20fill-opacity=%220.9%22/%3E%3Crect%20x=%22240%22%20y=%22240%22%20width=%2290%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.3%22/%3E%3Crect%20x=%22140%22%20y=%22270%22%20width=%22140%22%20height=%2210%22%20rx=%225%22%20fill=%22%23fff%22%20fill-opacity=%220.25%22/%3E%3Crect%20x=%22380%22%20y=%22200%22%20width=%22330%22%20height=%22230%22%20rx=%2218%22%20fill=%22%230b1633%22%20stroke=%22%23fff%22%20stroke-opacity=%22.14%22/%3E%3Crect%20x=%22410%22%20y=%22340%22%20width=%2230%22%20height=%2260%22%20rx=%228%22%20fill=%22url(%23ac4)%22%20fill-opacity=%220.55%22/%3E%3Crect%20x=%22458%22%20y=%22300%22%20width=%2230%22%20height=%22100%22%20rx=%228%22%20fill=%22url(%23ac4)%22%20fill-opacity=%220.63%22/%3E%3Crect%20x=%22506%22%20y=%22320%22%20width=%2230%22%20height=%2280%22%20rx=%228%22%20fill=%22url(%23ac4)%22%20fill-opacity=%220.7100000000000001%22/%3E%3Crect%20x=%22554%22%20y=%22260%22%20width=%2230%22%20height=%22140%22%20rx=%228%22%20fill=%22url(%23ac4)%22%20fill-opacity=%220.79%22/%3E%3Crect%20x=%22602%22%20y=%22280%22%20width=%2230%22%20height=%22120%22%20rx=%228%22%20fill=%22url(%23ac4)%22%20fill-opacity=%220.8700000000000001%22/%3E%3Crect%20x=%22650%22%20y=%22230%22%20width=%2230%22%20height=%22170%22%20rx=%228%22%20fill=%22url(%23ac4)%22%20fill-opacity=%220.9500000000000001%22/%3E%3Cpath%20d=%22M410%20330%20C%20470%20300,%20500%20340,%20560%20280%20S%20650%20230,%20690%20220%22%20fill=%22none%22%20stroke=%22%23fbbf24%22%20stroke-width=%224%22%20stroke-linecap=%22round%22/%3E%3Ccircle%20cx=%22690%22%20cy=%22220%22%20r=%228%22%20fill=%22%23fbbf24%22/%3E%3Cg%20transform=%22translate(560%2070)%22%3E%3Crect%20width=%22130%22%20height=%2246%22%20rx=%2223%22%20fill=%22%23fff%22%20fill-opacity=%22.08%22%20stroke=%22%23fff%22%20stroke-opacity=%22.2%22/%3E%3Ctext%20x=%2265%22%20y=%2229%22%20fill=%22%23fff%22%20font-family=%22Inter,Arial%22%20font-size=%2216%22%20font-weight=%22700%22%20text-anchor=%22middle%22%3Eimport%20pandas%3C/text%3E%3C/g%3E%20%3C/svg%3E",
  "career-placements": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20800%20500%22%20preserveAspectRatio=%22xMidYMid%20slice%22%3E%20%3Cdefs%3E%20%3ClinearGradient%20id=%22bg5%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%230a1a3f%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23050d24%22/%3E%3C/linearGradient%3E%20%3CradialGradient%20id=%22g15%22%20cx=%22.2%22%20cy=%22.15%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%23f59e0b%22%20stop-opacity=%22.55%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23f59e0b%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3CradialGradient%20id=%22g25%22%20cx=%22.9%22%20cy=%22.95%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%23ef4444%22%20stop-opacity=%22.5%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23ef4444%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%20%3ClinearGradient%20id=%22ac5%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%23f59e0b%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23ef4444%22/%3E%3C/linearGradient%3E%20%3Cpattern%20id=%22gr5%22%20width=%2240%22%20height=%2240%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M40%200H0V40%22%20fill=%22none%22%20stroke=%22%23fff%22%20stroke-opacity=%22.05%22/%3E%3C/pattern%3E%20%3C/defs%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23bg5)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23gr5)%22/%3E%20%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g15)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g25)%22/%3E%20%3Cg%20fill=%22url(%23ac5)%22%3E%3Crect%20x=%22110%22%20y=%22340%22%20width=%2262%22%20height=%2290%22%20rx=%2214%22%20fill-opacity=%220.35%22/%3E%3Crect%20x=%22200%22%20y=%22290%22%20width=%2262%22%20height=%22140%22%20rx=%2214%22%20fill-opacity=%220.5%22/%3E%3Crect%20x=%22290%22%20y=%22240%22%20width=%2262%22%20height=%22190%22%20rx=%2214%22%20fill-opacity=%220.6499999999999999%22/%3E%3Crect%20x=%22380%22%20y=%22180%22%20width=%2262%22%20height=%22250%22%20rx=%2214%22%20fill-opacity=%220.7999999999999999%22/%3E%3Crect%20x=%22470%22%20y=%22110%22%20width=%2262%22%20height=%22320%22%20rx=%2214%22%20fill-opacity=%220.95%22/%3E%3C/g%3E%3Cpath%20d=%22M120%20330%20L210%20280%20L300%20240%20L390%20170%20L490%20100%22%20fill=%22none%22%20stroke=%22%23fff%22%20stroke-width=%224%22%20stroke-linecap=%22round%22%20stroke-dasharray=%222%2012%22/%3E%3Cg%20transform=%22translate(520%20120)%22%3E%3Crect%20x=%220%22%20y=%2240%22%20width=%22190%22%20height=%22130%22%20rx=%2220%22%20fill=%22%230b1633%22%20stroke=%22url(%23ac5)%22%20stroke-width=%224%22/%3E%3Cpath%20d=%22M60%2040%20V22%20Q60%208%2076%208%20H114%20Q130%208%20130%2022%20V40%22%20fill=%22none%22%20stroke=%22url(%23ac5)%22%20stroke-width=%224%22/%3E%3Crect%20x=%220%22%20y=%2292%22%20width=%22190%22%20height=%2210%22%20fill=%22url(%23ac5)%22%20fill-opacity=%22.6%22/%3E%3Crect%20x=%2282%22%20y=%2284%22%20width=%2226%22%20height=%2226%22%20rx=%226%22%20fill=%22%23fbbf24%22/%3E%3C/g%3E%20%3Cg%20transform=%22translate(540%20330)%22%3E%3Crect%20width=%22170%22%20height=%2252%22%20rx=%2226%22%20fill=%22%23fff%22%20fill-opacity=%22.08%22%20stroke=%22%23fff%22%20stroke-opacity=%22.2%22/%3E%3Ctext%20x=%2285%22%20y=%2233%22%20fill=%22%23fff%22%20font-family=%22Inter,Arial%22%20font-size=%2217%22%20font-weight=%22700%22%20text-anchor=%22middle%22%3EOffer%20Letter%3C/text%3E%3C/g%3E%20%3C/svg%3E",
  "cloud": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20800%20500%22%20preserveAspectRatio=%22xMidYMid%20slice%22%3E%3Cdefs%3E%3ClinearGradient%20id=%22bg7%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%230a1a3f%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%23050d24%22/%3E%3C/linearGradient%3E%3CradialGradient%20id=%22g17%22%20cx=%22.2%22%20cy=%22.15%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%2338bdf8%22%20stop-opacity=%22.55%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%2338bdf8%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%3CradialGradient%20id=%22g27%22%20cx=%22.9%22%20cy=%22.95%22%20r=%22.7%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%236366f1%22%20stop-opacity=%22.5%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%236366f1%22%20stop-opacity=%220%22/%3E%3C/radialGradient%3E%3ClinearGradient%20id=%22ac7%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%22%20stop-color=%22%2338bdf8%22/%3E%3Cstop%20offset=%221%22%20stop-color=%22%236366f1%22/%3E%3C/linearGradient%3E%3Cpattern%20id=%22gr7%22%20width=%2240%22%20height=%2240%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M40%200H0V40%22%20fill=%22none%22%20stroke=%22%23fff%22%20stroke-opacity=%22.05%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23bg7)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23gr7)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g17)%22/%3E%3Crect%20width=%22800%22%20height=%22500%22%20fill=%22url(%23g27)%22/%3E%3Cpath%20d=%22M240%20330%20H570%20A85%2085%200%200%200%20560%20160%20A120%20120%200%200%200%20330%20140%20A95%2095%200%200%200%20240%20330%20Z%22%20fill=%22%230b1633%22%20stroke=%22url(%23ac7)%22%20stroke-width=%226%22/%3E%3Cpath%20d=%22M270%20310%20H555%20A65%2065%200%200%200%20548%20180%20A100%20100%200%200%200%20340%20160%20A75%2075%200%200%200%20270%20310%20Z%22%20fill=%22url(%23ac7)%22%20fill-opacity=%22.2%22/%3E%3Cg%20fill=%22%23fff%22%20fill-opacity=%22.85%22%3E%3Crect%20x=%22330%22%20y=%22215%22%20width=%22140%22%20height=%2212%22%20rx=%226%22/%3E%3Crect%20x=%22330%22%20y=%22245%22%20width=%22100%22%20height=%2212%22%20rx=%226%22%20fill-opacity=%22.45%22/%3E%3C/g%3E%3Cg%20stroke=%22%2322d3ee%22%20stroke-width=%223%22%20stroke-dasharray=%224%208%22%20stroke-opacity=%22.7%22%3E%3Cline%20x1=%22300%22%20y1=%22345%22%20x2=%22220%22%20y2=%22420%22/%3E%3Cline%20x1=%22400%22%20y1=%22345%22%20x2=%22400%22%20y2=%22430%22/%3E%3Cline%20x1=%22500%22%20y1=%22345%22%20x2=%22580%22%20y2=%22420%22/%3E%3C/g%3E%3Cg%20fill=%22%230b1633%22%20stroke=%22url(%23ac7)%22%20stroke-width=%223%22%3E%3Crect%20x=%22180%22%20y=%22410%22%20width=%2280%22%20height=%2250%22%20rx=%2210%22/%3E%3Crect%20x=%22360%22%20y=%22425%22%20width=%2280%22%20height=%2250%22%20rx=%2210%22/%3E%3Crect%20x=%22540%22%20y=%22410%22%20width=%2280%22%20height=%2250%22%20rx=%2210%22/%3E%3C/g%3E%3C/svg%3E",
} as const;

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type Post = {
  id: number;
  slug: string;
  title: string;
  date: string;
  readMinutes: number;
  author: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  cover: keyof typeof covers;
  content: string;
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`;

const posts: Post[] = [
  {
    id: 1,
    slug: "7-habits-to-learn-programming-faster",
    title: "7 Habits to Learn Programming Faster",
    date: "2025-03-18",
    readMinutes: 5,
    author: "Neha Gupta",
    excerpt:
      "Small, consistent habits that help beginners move from tutorials to writing confident, working code.",
    category: "Programming",
    tags: ["Beginners", "Habits", "Coding"],
    image: unsplash("photo-1555066931-4365d14bab8c"),
    cover: "interview-prep",
    content: `
      <h2>Consistency beats intensity</h2>
      <p>Most people don't fail at programming because it is too hard. They stop because they have no routine. These seven habits keep you moving.</p>

      <h3>1. Code every single day</h3>
      <p>Even 30 focused minutes a day builds more skill than a six-hour weekend binge. Protect the streak.</p>

      <h3>2. Build before you feel ready</h3>
      <p>Tutorials give a false sense of progress. Start a small project in your first week and learn what you need as you go.</p>

      <h3>3. Read other people's code</h3>
      <p>Open-source repositories show you naming, structure and patterns that no course can fully teach.</p>

      <h3>4. Debug with a method</h3>
      <ul>
        <li>Reproduce the bug reliably</li>
        <li>Read the error message completely</li>
        <li>Change one thing at a time</li>
      </ul>

      <h3>5. Learn Git early</h3>
      <p>Version control is a daily tool in every team. Commit small and write clear messages.</p>

      <h3>6. Explain what you learn</h3>
      <p>Teaching a concept to a friend, or writing it down, exposes the gaps in your understanding.</p>

      <h3>7. Ask for feedback</h3>
      <p>Code reviews from a mentor shorten the learning curve more than anything else.</p>
    `,
  },
  {
    id: 2,
    slug: "build-a-fresher-resume-that-gets-shortlisted",
    title: "Build a Fresher Resume That Gets Shortlisted",
    date: "2025-03-05",
    readMinutes: 7,
    author: "Sneha Iyer",
    excerpt:
      "A step-by-step plan to build your resume, ace aptitude rounds and land your first job in the IT industry.",
    category: "Career Growth",
    tags: ["Placements", "Resume", "Freshers"],
    image: unsplash("photo-1434030216411-0b793f4b4173"),
    cover: "career-placements",
    content: `
      <h2>Your placement roadmap</h2>
      <p>Landing your first role is a process, not a lucky break. Break it into stages and prepare for each one deliberately.</p>

      <h3>Build a resume that gets shortlisted</h3>
      <ul>
        <li>Keep it to one page with clear, quantified achievements</li>
        <li>Showcase two or three real projects with links</li>
        <li>List skills that match the job description</li>
      </ul>

      <h3>Crack the screening rounds</h3>
      <p>Practice aptitude, logical reasoning and basic coding questions weekly so the first round never feels new.</p>

      <h3>Interview with confidence</h3>
      <p>Run mock interviews, record yourself, and refine how you explain your projects in under two minutes.</p>
    `,
  },
  {
    id: 3,
    slug: "cloud-fundamentals-for-beginners",
    title: "Cloud Fundamentals Every Beginner Should Know",
    date: "2025-02-24",
    readMinutes: 9,
    author: "Vikram Rao",
    excerpt:
      "Understand IaaS, PaaS and SaaS, core cloud services and the certifications that open doors to cloud careers.",
    category: "Cloud",
    tags: ["Azure", "Cloud", "Careers"],
    image: unsplash("photo-1558494949-ef010cbdcc31"),
    cover: "cloud",
    content: `
      <h2>Why cloud skills matter</h2>
      <p>Almost every modern application runs on the cloud. Understanding the basics makes you valuable in development, data and operations roles.</p>

      <h3>The three service models</h3>
      <ul>
        <li><strong>IaaS</strong> gives you virtual machines, storage and networks</li>
        <li><strong>PaaS</strong> lets you deploy code without managing servers</li>
        <li><strong>SaaS</strong> delivers ready-to-use software over the internet</li>
      </ul>

      <h3>Core services to learn first</h3>
      <p>Start with compute, storage, networking, identity and databases. Every cloud provider offers an equivalent of each.</p>

      <h3>Certifications that help</h3>
      <p>Entry-level cloud certifications give you structure, vocabulary and a credential recruiters recognise.</p>
    `,
  },
  {
    id: 4,
    slug: "top-frontend-tools-and-libraries-shaping-2025",
    title: "Top Frontend Tools and Libraries Shaping 2025",
    date: "2025-02-10",
    readMinutes: 6,
    author: "Priya Sharma",
    excerpt:
      "Explore the cutting-edge tools and frameworks that are revolutionizing frontend development this year.",
    category: "Frontend",
    tags: ["React", "Tools", "Innovation"],
    image: unsplash("photo-1498050108023-c5249f4df085"),
    cover: "frontend-tools",
    content: `
      <h2>The future of frontend development</h2>
      <p>Frontend development continues to evolve at a rapid pace. Here are the tools you need to master in 2025.</p>

      <h3>Framework innovations</h3>
      <p><strong>React 19+</strong> brings concurrent features and improved server components.</p>
      <p><strong>Vue 3.4</strong> offers better TypeScript support and performance optimizations.</p>
      <p><strong>Svelte 5</strong> introduces runes for reactive state management.</p>

      <h3>Build tools revolution</h3>
      <p><strong>Vite 5</strong> continues to lead with lightning-fast builds and excellent developer experience.</p>
      <p><strong>Turbopack</strong> from the Next.js team offers incremental bundling.</p>

      <h3>AI-powered development</h3>
      <p>Tools like GitHub Copilot and Amazon CodeWhisperer are becoming essential for productivity.</p>
    `,
  },
  {
    id: 5,
    slug: "the-rise-of-personalized-learning-in-education",
    title: "The Rise of Personalized Learning in Education",
    date: "2025-01-28",
    readMinutes: 10,
    author: "Dr. Rajesh Kumar",
    excerpt:
      "Discover how personalized learning technology is transforming the education sector.",
    category: "EdTech",
    tags: ["AI", "Education", "Innovation"],
    image: unsplash("photo-1503676260728-1c00da094a0b"),
    cover: "ai-education",
    content: `
      <h2>A learning revolution</h2>
      <p>Technology is changing how we learn, teach and assess outcomes. Personalization is at the centre of that change.</p>

      <h3>Personalized learning paths</h3>
      <p>Algorithms analyze student performance to create customized learning journeys that adapt to each learner's pace.</p>

      <h3>Intelligent tutoring systems</h3>
      <p>Round-the-clock AI tutors provide instant feedback and guidance, so doubts never wait until the next class.</p>

      <h3>Smarter assessment</h3>
      <p>Machine learning models can evaluate complex assignments and provide detailed, actionable feedback.</p>
    `,
  },
  {
    id: 6,
    slug: "mastering-python-for-data-science",
    title: "Mastering Python for Data Science",
    date: "2025-01-20",
    readMinutes: 12,
    author: "Neha Gupta",
    excerpt:
      "Comprehensive guide to Python libraries and techniques for effective data analysis and machine learning.",
    category: "Data Science",
    tags: ["Python", "Data Science", "ML"],
    image: unsplash("photo-1551288049-bebda4e38f71"),
    cover: "python-ds",
    content: `
      <h2>Python for data professionals</h2>
      <p>Python remains the language of choice for data science. Here's how to master it.</p>

      <h3>Essential libraries</h3>
      <p><strong>Pandas</strong> for data manipulation and analysis.</p>
      <p><strong>NumPy</strong> for numerical computing.</p>
      <p><strong>Matplotlib &amp; Seaborn</strong> for data visualization.</p>

      <h3>Machine learning with Scikit-learn</h3>
      <p>Comprehensive guide to implementing ML algorithms.</p>
    `,
  },
  {
    id: 7,
    slug: "how-to-prepare-for-coding-interviews-in-2025",
    title: "How to Prepare for Coding Interviews in 2025",
    date: "2025-01-15",
    readMinutes: 8,
    author: "Arjun Patel",
    excerpt:
      "Master the art of technical interviews with our comprehensive guide covering data structures, system design, and behavioral questions.",
    category: "Interview Prep",
    tags: ["Coding", "Interview", "Career"],
    image: unsplash("photo-1573496359142-b8d87734a5a2"),
    cover: "interview-prep",
    content: `
      <h2>Mastering technical interviews</h2>
      <p>Technical interviews can be daunting, but with the right preparation, you can confidently tackle any challenge that comes your way.</p>

      <h3>Data structures &amp; algorithms</h3>
      <p>Focus on mastering core data structures like arrays, linked lists, trees, and graphs. Practice common algorithm patterns including:</p>
      <ul>
        <li>Two-pointer technique</li>
        <li>Sliding window</li>
        <li>Depth-first and breadth-first search</li>
        <li>Dynamic programming</li>
      </ul>

      <h3>System design fundamentals</h3>
      <p>For senior roles, system design becomes crucial. Understand scalability, database design, caching strategies and load balancing.</p>

      <h3>Behavioral questions</h3>
      <p>Prepare STAR (Situation, Task, Action, Result) stories for common behavioral questions.</p>
    `,
  },
];

const SITE_TITLE = "Skill Training Center";
const STORAGE_KEY = "stc-blog-saved";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const initials = (name: string) =>
  name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

const slugFromHash = () => {
  if (typeof window === "undefined") return null;
  const s = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  return posts.some((p) => p.slug === s) ? s : null;
};

const articleBody =
  "text-[17px] leading-8 text-slate-600 " +
  "[&_h2]:mb-4 [&_h2]:mt-2 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-slate-900 " +
  "[&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-indigo-600 " +
  "[&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-slate-900 " +
  "[&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:pl-0 [&_li]:relative [&_li]:list-none [&_li]:pl-7 " +
  "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7em] [&_li]:before:h-2 [&_li]:before:w-2 " +
  "[&_li]:before:rounded-full [&_li]:before:bg-gradient-to-r [&_li]:before:from-blue-500 [&_li]:before:to-violet-500 [&_li]:before:content-['']";

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

/** Image with shimmer placeholder, lazy loading and automatic fallback. */
function SmartImage({
  src,
  fallback,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [current]);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-indigo-100 via-violet-100 to-sky-100" />
      )}
      <img
        ref={ref}
        src={current}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== fallback) {
            setLoaded(false);
            setCurrent(fallback);
          }
        }}
        className={`${className} transition-[opacity,transform] duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 font-bold text-white ${
        size === "sm" ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-xs"
      }`}
    >
      {initials(name)}
    </span>
  );
}

function SaveButton({
  saved,
  onToggle,
  className = "",
}: {
  saved: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save for later"}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/95 text-indigo-600 shadow-md backdrop-blur transition hover:scale-110 active:scale-95 ${className}`}
    >
      {saved ? (
        <BookmarkSolidIcon className="h-[18px] w-[18px]" />
      ) : (
        <BookmarkIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Article modal                                                             */
/* -------------------------------------------------------------------------- */

function ArticleModal({
  post,
  index,
  total,
  related,
  saved,
  onToggleSave,
  onClose,
  onOpen,
  onStep,
  onCopy,
}: {
  post: Post;
  index: number;
  total: number;
  related: Post[];
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
  onOpen: (slug: string) => void;
  onStep: (dir: 1 | -1) => void;
  onCopy: (post: Post) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [post.slug]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Reading progress */}
        <div className="absolute inset-x-0 top-0 z-20 h-1 bg-indigo-100">
          <motion.div
            style={{ scaleX: progress }}
            className="h-full origin-left bg-gradient-to-r from-blue-500 to-violet-500"
          />
        </div>

        <div className="absolute right-4 top-4 z-20 flex gap-2">
          <SaveButton saved={saved} onToggle={onToggleSave} />
          <button
            onClick={onClose}
            aria-label="Close article"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-slate-700 shadow-md backdrop-blur transition hover:rotate-90"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="overflow-y-auto overscroll-contain">
          <div className="relative aspect-[16/7] w-full overflow-hidden bg-indigo-100">
            <SmartImage
              src={post.image}
              fallback={covers[post.cover]}
              alt={post.title}
              eager
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
          </div>

          <div className="-mt-10 px-6 pb-4 sm:px-10">
            <div className="relative flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 ring-1 ring-indigo-100">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <CalendarIcon className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <ClockIcon className="h-4 w-4" />
                {post.readMinutes} min read
              </span>
            </div>

            <h2 className="relative mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {post.title}
            </h2>

            <div className="mt-5 flex items-center gap-3 border-b border-slate-100 pb-6">
              <Avatar name={post.author} />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-900">{post.author}</div>
                <div className="text-xs text-slate-500">{SITE_TITLE}</div>
              </div>
            </div>

            <div
              className={`${articleBody} mt-8`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onCopy(post)}
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                >
                  <LinkIcon className="h-4 w-4" /> Copy link
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: post.title,
                          text: post.excerpt,
                          url: window.location.href,
                        })
                        .catch(() => {});
                    } else {
                      onCopy(post);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:scale-105 active:scale-95"
                >
                  <ShareIcon className="h-4 w-4" /> Share
                </button>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-extrabold text-slate-900">Read next</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <button
                      key={r.slug}
                      onClick={() => onOpen(r.slug)}
                      className="group flex items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-indigo-100">
                        <SmartImage
                          src={r.image}
                          fallback={covers[r.cover]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-wide text-indigo-500">
                          {r.category}
                        </span>
                        <span className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-indigo-600">
                          {r.title}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prev / next */}
            <div className="mb-6 mt-8 flex items-center justify-between gap-3">
              <button
                onClick={() => onStep(-1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                <ChevronLeftIcon className="h-4 w-4" /> Previous
              </button>
              <span className="text-xs text-slate-400">
                {index + 1} / {total} &middot; use ← → keys
              </span>
              <button
                onClick={() => onStep(1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                Next <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

type SortKey = "newest" | "oldest" | "quick";

export default function Blog() {
  usePageMeta("Blog", "Career advice, technology guides and learning tips from Skill Training Center.");
  const [activeSlug, setActiveSlug] = useState<string | null>(slugFromHash);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const { scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  const byDate = useMemo(
    () => [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [],
  );
  const categories = useMemo(
    () => ["all", ...Array.from(new Set(byDate.map((p) => p.category)))],
    [byDate],
  );
  const activePost = activeSlug ? posts.find((p) => p.slug === activeSlug) ?? null : null;

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  /* ---- persistence: saved articles ---- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* storage unavailable */
    }
  }, [saved]);

  const toggleSave = (slug: string) => {
    setSaved((s) => {
      const has = s.includes(slug);
      showToast(has ? "Removed from saved" : "Saved for later");
      return has ? s.filter((x) => x !== slug) : [...s, slug];
    });
  };

  /* ---- deep links: #article-slug ---- */
  const openPost = (slug: string) => {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${slug}`);
    setActiveSlug(slug);
  };
  const closePost = () => {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    setActiveSlug(null);
  };
  useEffect(() => {
    const sync = () => setActiveSlug(slugFromHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const step = (dir: 1 | -1) => {
    if (!activeSlug) return;
    const i = byDate.findIndex((p) => p.slug === activeSlug);
    openPost(byDate[(i + dir + byDate.length) % byDate.length].slug);
  };

  /* ---- modal side effects: scroll lock, keys, title, structured data ---- */
  useEffect(() => {
    if (!activePost) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePost();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const prevTitle = document.title;
    document.title = `${activePost.title} | ${SITE_TITLE} Blog`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? null;
    meta?.setAttribute("content", activePost.excerpt);

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: activePost.title,
      description: activePost.excerpt,
      datePublished: activePost.date,
      author: { "@type": "Person", name: activePost.author },
      publisher: { "@type": "Organization", name: SITE_TITLE },
    });
    document.head.appendChild(ld);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute("content", prevDesc);
      ld.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug]);

  /* ---- "/" focuses search, back-to-top visibility ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "/" && !typing && !activeSlug) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeSlug]);

  /* ---- filtering + sorting ---- */
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = byDate.filter((p) => {
      const okCat = activeCategory === "all" || p.category === activeCategory;
      const okSaved = !savedOnly || saved.includes(p.slug);
      const okSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return okCat && okSaved && okSearch;
    });
    if (sort === "oldest") return [...list].reverse();
    if (sort === "quick") return [...list].sort((a, b) => a.readMinutes - b.readMinutes);
    return list;
  }, [byDate, activeCategory, searchTerm, savedOnly, saved, sort]);

  const showFeatured =
    sort === "newest" && activeCategory === "all" && !searchTerm.trim() && !savedOnly && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : null;
  const gridPosts = showFeatured ? filtered.slice(1) : filtered;

  const copyLink = async (post: Post) => {
    const url = `${window.location.origin}${window.location.pathname}#${post.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Could not copy link");
    }
  };

  const related = activePost
    ? [
        ...byDate.filter((p) => p.slug !== activePost.slug && p.category === activePost.category),
        ...byDate.filter((p) => p.slug !== activePost.slug && p.category !== activePost.category),
      ].slice(0, 2)
    : [];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    showToast("You're subscribed!");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("all");
    setSavedOnly(false);
    setSort("newest");
  };

  return (
    <Layout>
      <MotionConfig reducedMotion="user">
        {/* Page scroll progress */}
        <motion.div
          style={{ scaleX: pageProgress }}
          className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500"
        />

        <div className="relative overflow-hidden bg-gradient-to-b from-[#e8ecff] via-[#f3f2ff] to-[#f8f6ff] text-slate-700">
          {/* Soft colour washes */}
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-32 -top-24 h-[26rem] w-[26rem] rounded-full bg-sky-300/40 blur-[110px]"
            />
            <motion.div
              animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-violet-300/40 blur-[120px]"
            />
            <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-fuchsia-200/40 blur-[120px]" />
          </div>

          <section className="container relative max-w-7xl py-14 md:py-20">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-700 shadow-sm backdrop-blur">
                <BookOpenIcon className="h-4 w-4" />
                Knowledge Hub
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Insights to power your
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                  learning journey
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
                Tutorials, career guides and industry trends from our trainers —
                everything you need to learn, build and grow.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto mt-10 max-w-2xl"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles or topics..."
                  aria-label="Search articles"
                  className="w-full rounded-2xl border border-white bg-white py-4 pl-14 pr-14 text-slate-800 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.25)] outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-200/60"
                />
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-400 sm:block">
                    /
                  </kbd>
                )}
              </div>
              <p className="mt-4 text-center text-sm text-slate-500">
                {posts.length} articles &middot; {categories.length - 1} topics &middot; new reads every week
              </p>
            </motion.div>

            {/* Category pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mx-auto mt-8 flex max-w-5xl gap-2.5 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((category) => {
                const active = activeCategory === category;
                const count =
                  category === "all"
                    ? posts.length
                    : posts.filter((p) => p.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      active
                        ? "text-white"
                        : "border border-white bg-white/80 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="blogActivePill"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-indigo-500/30"
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      {category === "all" ? "All Topics" : category}
                      <span
                        className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold ${
                          active ? "bg-white/25 text-white" : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </motion.div>

            {/* Toolbar */}
            <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                {showFeatured ? "Latest articles" : "Articles"}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setSavedOnly((v) => !v)}
                  aria-pressed={savedOnly}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    savedOnly
                      ? "border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                      : "border-white bg-white/80 text-slate-700 hover:border-indigo-200"
                  }`}
                >
                  <BookmarkIcon className="h-4 w-4" />
                  Saved
                  <span
                    className={`rounded-full px-1.5 text-[11px] ${
                      savedOnly ? "bg-white/25" : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {saved.length}
                  </span>
                </button>
                <label className="sr-only" htmlFor="blog-sort">
                  Sort articles
                </label>
                <select
                  id="blog-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-full border border-white bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition hover:border-indigo-200 focus:ring-4 focus:ring-indigo-200/60"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="quick">Quickest reads</option>
                </select>
                <span className="text-sm text-slate-500" aria-live="polite">
                  {filtered.length} {filtered.length === 1 ? "article" : "articles"}
                </span>
              </div>
            </div>

            {/* Featured */}
            <AnimatePresence mode="wait">
              {featured && (
                <motion.article
                  key={`featured-${featured.slug}`}
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.55 }}
                  className="group relative mt-8 overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_20px_60px_-15px_rgba(79,70,229,0.25)] transition-all duration-500 hover:shadow-[0_30px_80px_-15px_rgba(79,70,229,0.4)] focus-within:ring-4 focus-within:ring-indigo-300/60"
                >
                  <div className="grid lg:grid-cols-[1.1fr_1fr]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-indigo-100 lg:aspect-auto lg:min-h-[420px]">
                      <SmartImage
                        src={featured.image}
                        fallback={covers[featured.cover]}
                        alt={featured.title}
                        eager
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105"
                      />
                      <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-indigo-600 shadow-lg">
                        <SparklesIcon className="h-4 w-4" /> Featured
                      </span>
                      <SaveButton
                        saved={saved.includes(featured.slug)}
                        onToggle={() => toggleSave(featured.slug)}
                        className="absolute right-5 top-5 z-10"
                      />
                    </div>

                    <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                      <span className="w-fit rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-600">
                        {featured.category}
                      </span>
                      <h3 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
                        <button
                          onClick={() => openPost(featured.slug)}
                          className="bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-left text-transparent outline-none after:absolute after:inset-0 after:content-['']"
                        >
                          {featured.title}
                        </button>
                      </h3>
                      <p className="mt-4 text-lg leading-relaxed text-slate-600">
                        {featured.excerpt}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500">
                        <span className="flex items-center gap-2.5 font-semibold text-slate-800">
                          <Avatar name={featured.author} />
                          {featured.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon className="h-4 w-4" />
                          {formatDate(featured.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ClockIcon className="h-4 w-4" />
                          {featured.readMinutes} min read
                        </span>
                      </div>

                      <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 group-hover:gap-3.5 group-hover:shadow-xl group-hover:shadow-indigo-500/40">
                        Read article <ArrowRightIcon className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>

            {/* Grid */}
            <div className="mt-8">
              {filtered.length > 0 ? (
                gridPosts.length > 0 && (
                  <motion.div layout className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                      {gridPosts.map((post, i) => (
                        <motion.article
                          key={post.slug}
                          layout
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                          className="group relative flex flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-[0_10px_40px_-12px_rgba(79,70,229,0.2)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_60px_-14px_rgba(79,70,229,0.4)] focus-within:ring-4 focus-within:ring-indigo-300/60"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-indigo-100">
                            <SmartImage
                              src={post.image}
                              fallback={covers[post.cover]}
                              alt={post.title}
                              className="h-full w-full object-cover group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-indigo-600 shadow-md backdrop-blur">
                              {post.category}
                            </span>
                            <SaveButton
                              saved={saved.includes(post.slug)}
                              onToggle={() => toggleSave(post.slug)}
                              className="absolute right-4 top-4 z-10 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                            />
                          </div>

                          <div className="flex flex-1 flex-col p-6">
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1.5">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {formatDate(post.date)}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-slate-300" />
                              <span className="flex items-center gap-1.5">
                                <ClockIcon className="h-3.5 w-3.5" />
                                {post.readMinutes} min read
                              </span>
                            </div>

                            <h3 className="mt-3 text-xl font-extrabold leading-snug text-slate-900">
                              <button
                                onClick={() => openPost(post.slug)}
                                className="text-left outline-none transition-colors duration-300 after:absolute after:inset-0 after:content-[''] group-hover:text-indigo-600"
                              >
                                {post.title}
                              </button>
                            </h3>
                            <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-slate-600">
                              {post.excerpt}
                            </p>

                            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                              <span className="mt-5 flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                                <Avatar name={post.author} size="sm" />
                                {post.author}
                              </span>
                              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition-all duration-300 group-hover:gap-2.5">
                                Read <ArrowRightIcon className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-dashed border-indigo-200 bg-white/70 px-6 py-20 text-center"
                >
                  <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-indigo-50 text-indigo-500">
                    <BookOpenIcon className="h-9 w-9" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
                  <p className="mx-auto mt-2 max-w-sm text-slate-500">
                    {savedOnly && saved.length === 0
                      ? "You haven't saved any articles yet. Tap the bookmark on a card to save it."
                      : "Try adjusting your search or filter to find what you're looking for."}
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-6 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:scale-105 active:scale-95"
                  >
                    Reset filters
                  </button>
                </motion.div>
              )}
            </div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-8 shadow-[0_30px_70px_-20px_rgba(79,70,229,0.6)] sm:p-12"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />

              <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="flex items-center gap-5">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
                    <EnvelopeIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                      Get fresh insights in your inbox
                    </h2>
                    <p className="mt-1 text-white/80">
                      One short email a week. No spam — unsubscribe anytime.
                    </p>
                  </div>
                </div>

                {subscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-600"
                  >
                    <CheckIcon className="h-5 w-5" /> Thanks for subscribing!
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubscribe}
                    className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[480px]"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      aria-label="Email address"
                      className="flex-1 rounded-xl border-0 bg-white px-5 py-3.5 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/40"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-white px-7 py-3.5 font-bold text-indigo-700 shadow-lg transition hover:scale-105 hover:shadow-xl active:scale-95"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </section>
        </div>

        {/* Article modal */}
        <AnimatePresence>
          {activePost && (
            <ArticleModal
              key="article-modal"
              post={activePost}
              index={byDate.findIndex((p) => p.slug === activePost.slug)}
              total={byDate.length}
              related={related}
              saved={saved.includes(activePost.slug)}
              onToggleSave={() => toggleSave(activePost.slug)}
              onClose={closePost}
              onOpen={openPost}
              onStep={step}
              onCopy={copyLink}
            />
          )}
        </AnimatePresence>

        {/* Back to top */}
        <AnimatePresence>
          {showTop && !activePost && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xl shadow-indigo-500/40 transition hover:scale-110"
            >
              <ArrowUpIcon className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl"
            >
              <CheckIcon className="h-4 w-4 text-emerald-400" />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </Layout>
  );
}
